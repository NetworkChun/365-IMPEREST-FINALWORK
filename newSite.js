// Load saved data from localStorage or initialize empty array
let imprestData = JSON.parse(localStorage.getItem('imprestData')) || [];

// Utility to check for duplicates
function isDuplicateOption(selectElement, value) {
  return [...selectElement.options].some(opt => opt.value.toLowerCase() === value.toLowerCase());
}

// Add new Name
document.getElementById('addNameBtn').onclick = () => {
  const newName = prompt('Enter new name');
  if (newName) {
    const nameSelect = document.getElementById('name');
    if (!isDuplicateOption(nameSelect, newName)) {
      const option = document.createElement('option');
      option.text = newName;
      option.value = newName;
      nameSelect.add(option);
      alert(`✅ "${newName}" added.`);
    } else {
      alert('⚠️ Name already exists.');
    }
  }
};

/* // Add new Department (even though dept is not currently visible)
document.getElementById('addDeptBtn').onclick = () => {
  alert('⚠️ Department field is currently commented out in the HTML.');
};
 */
// Add new Split
document.getElementById('addSplitBtn').onclick = () => {
  const newSplit = prompt('Enter new split category');
  if (newSplit) {
    const splitSelect = document.getElementById('split');
    if (!isDuplicateOption(splitSelect, newSplit)) {
      const option = document.createElement('option');
      option.text = newSplit;
      option.value = newSplit;
      splitSelect.add(option);
      alert(`✅ "${newSplit}" added.`);
    } else {
      alert('⚠️ Split already exists.');
    }
  }
};

// Save data
document.getElementById('saveBtn').onclick = async (e) => {
  e.preventDefault();

  // Get form values
  const name = document.getElementById('name').value;
  const split = document.getElementById('split').value;
  const amount = document.getElementById('amount').value;
  const memo = document.getElementById('memo').value;
  const date = document.getElementById('date').value;

  // Basic validation
  if (!name || !split || !amount || !memo || !date) {
    alert('⚠️ Please fill in all fields.');
    return;
  }

  // Add to local data
  imprestData.push({ date, name, split, amount, memo });
  localStorage.setItem('imprestData', JSON.stringify(imprestData));

  // Show summary
  alert(`✅ Data Saved:\n\n📅 Date: ${date}\n👤 Name: ${name}\n➗ Split: ${split}\n💰 Amount: ${amount}\n📍 Memo: ${memo}`);

  // Submit to SheetDB
  const webAppURL = 'https://sheetdb.io/api/v1/byifdznzpuyg4';
  const payload = {
    data: { Date: date, Name: name, Split: split, Amount: amount, Memo: memo },
  };

  try {
    const response = await fetch(webAppURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert('✅ Successfully sent to database.');
      document.getElementById('imprestForm').reset();
    } else {
      const errorText = await response.text();
      alert('❌ Failed to save to SheetDB: ' + errorText);
    }
  } catch (error) {
    alert('❌ Network error: ' + error.message);
  }
};

// View all records from SheetDB
document.getElementById('viewDataBtn').onclick = async () => {
  const webAppURL = 'https://sheetdb.io/api/v1/byifdznzpuyg4';

  try {
    const response = await fetch(webAppURL);
    const data = await response.json();

    if (!data.length) {
      document.getElementById('dataDisplay').innerHTML = '<p>No data found.</p>';
      return;
    }

    let table = '<table border="1" style="border-collapse: collapse; width: 100%;">';
    table += '<tr><th>Date</th><th>Name</th><th>Split</th><th>Amount</th><th>Memo</th></tr>';

    data.forEach(entry => {
      table += `<tr>
        <td>${entry.Date}</td>
        <td>${entry.Name}</td>
        <td>${entry.Split}</td>
        <td>${entry.Amount}</td>
        <td>${entry.Memo}</td>
      </tr>`;
    });

    table += '</table>';
    document.getElementById('dataDisplay').innerHTML = table;
    document.getElementById('dataDisplay').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    alert('❌ Error fetching data: ' + error.message);
  }
};
// Clear all records
/* document.getElementById('clearDataBtn').onclick = async () => {
  if (confirm('Are you sure you want to clear all records? This action cannot be undone.')) {
    const webAppURL = 'https://sheetdb.io/api/v1/byifdznzpuyg4';
    
    try {
      const response = await fetch(webAppURL, { method: 'DELETE' });
      if (response.ok) {
        imprestData = [];
        localStorage.removeItem('imprestData');
        document.getElementById('dataDisplay').innerHTML = '<p>All records cleared.</p>';
        alert('✅ All records cleared successfully.');
      } else {
        const errorText = await response.text();
        alert('❌ Failed to clear records: ' + errorText);
      }
    } catch (error) {
      alert('❌ Network error: ' + error.message);
    }
  }
}; */
