export const openDB = ({ DBName, storeName, version }) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DBName, version);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { autoIncrement: true });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const withStore = (db, storeName) => {
  const getStore = (mode) => {
    const transaction = db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  };

  return {
    getDataFromStore: (key) => {
      return new Promise((resolve, reject) => {
        const store = getStore('readonly');
        const getRequest = store.get(key);

        getRequest.onsuccess = () => {
          resolve({ ...getRequest.result, key });
        };

        getRequest.onerror = () => {
          reject(getRequest.error);
        };
      });
    },

    addDataToStore: (data) => {
      return new Promise((resolve, reject) => {
        const store = getStore('readwrite');
        const request = store.add(data);

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    },

    getAllDataFromStore: () => {
      return new Promise((resolve, reject) => {
        const store = getStore('readonly');
        const cursorRequest = store.openCursor();

        const allData = [];
        cursorRequest.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            allData.push({ key: cursor.key, ...cursor.value });
            cursor.continue();
          } else {
            resolve(allData);
          }
        };

        cursorRequest.onerror = () => {
          reject(cursorRequest.error);
        };
      });
    },

    deleteDataFromStore: (id) => {
      return new Promise((resolve, reject) => {
        const store = getStore('readwrite');
        const deleteRequest = store.delete(id);

        deleteRequest.onsuccess = () => {
          resolve(deleteRequest.result);
        };

        deleteRequest.onerror = () => {
          reject(deleteRequest.error);
        };
      });
    },

    updateDataInStore: (id, updatedData) => {
      return new Promise((resolve, reject) => {
        const store = getStore('readwrite');

        const getRequest = store.get(id);
        getRequest.onsuccess = () => {
          const data = getRequest.result;
          const dataToUpdate = { ...data, ...updatedData };

          const putRequest = store.put(dataToUpdate, id);
          putRequest.onsuccess = () => {
            resolve(putRequest.result);
          };

          putRequest.onerror = () => {
            reject(putRequest.error);
          };
        };

        getRequest.onerror = () => {
          reject(getRequest.error);
        };
      });
    },
  };
};
