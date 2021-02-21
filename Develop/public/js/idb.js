let db;

const request = indexedDB.open('budget', 1);

request.onupgradeneeded = e => {
  db = e.target.result;
  db.createObjectStore('transactions', { autoIncrement: true });
};

request.onsuccess = e => {
  db = e.target.result;

  if(navigator.onLine) {

  }
};

request.onerror = e => {
  console.log(e.target.errorCode, e.target.errorMessage);
};

const saveRecord = record => {
  const transaction = db.transaction(['transactions'], 'readwrite');

  const budgetObjectStore = transaction.objectStore('transactions');

  budgetObjectStore.add(record);
}

const saveRecords = () => {
  if (transactions.length > 0) {
    for (transaction in transactions) {
      saveRecord(transaction);
    }
  }
}

const uploadRecord = () => {
  const transaction = db.transaction(['transactions'], 'readwrite');

  const budgetObjectStore = transaction.objectStore('transactions');

  const getAll = budgetObjectStore.getAll();

  getAll.onsuccess = async () => {
    if (getAll.result.length > 0) {
      try {
        const response = await fetch('/api/transaction', {
          method: 'POST',
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          } 
        });

        if (response.json().message) {
          throw new Error(response);
        }

        // Clear the object store now
        const trans = db.transaction(['transactions'], 'readwrite');
        const oldObjectStore = trans.objectStore('transactions');
        oldObjectStore.clear();

        console.log('All offline transactions have been uploaded.');

      } catch (err) {
        console.log(err);
      }
    }
  }
};


window.addEventListener('online', uploadRecord);

