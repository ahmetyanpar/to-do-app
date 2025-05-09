import { useState, useEffect } from 'react';
import './App.css';

function App() {

  const [listItems, setListItems] = useState(() => {
    const stored = localStorage.getItem("todo-items");
    return stored ? JSON.parse(stored) : [];
  });
  const [newListItem, setNewListItem] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [deletedId, setDeletedId] = useState(null);

  useEffect(() => {
    localStorage.setItem("todo-items", JSON.stringify(listItems));
  }, [listItems]);

  function handleAddItem() {
    if (newListItem.trim()) {
      setListItems([...listItems, {id: crypto.randomUUID(), text: newListItem, completed: false}]);
    }
    setNewListItem("");
  }

  function handleDeleteItem(indexToRemove) {
    const idToRemove = listItems[indexToRemove].id;
    setDeletedId(idToRemove);

    setTimeout(() => {
      const updatedList = listItems.filter((_item, index) => index !== indexToRemove);
      setListItems(updatedList);
      setDeletedId(null);
    }, 300);
  }

  function handleToggleComplete(index) {
    const updatedList = listItems.map((item, i) => {
      if (i === index) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    setListItems(updatedList);
  }

  function handleExport() {
    const data = JSON.stringify(listItems, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "todo-items.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  function handleClearCompleted() {
    const activeTasks = listItems.filter(item => !item.completed);
    setListItems(activeTasks);
  }

  function handleSaveEdit(id) {
    const updatedList = listItems.map(item => 
      item.id === id ? { ...item, text: editText.trim() } : item
    );
    setListItems(updatedList);
    setEditingId(null);
    setEditText("");
  }

  return (
    <>
    <div className="min-h-screen bg-zinc-900 text-white p-6 flex items-start justify-center">
      <div className="w-full max-w-xl">
      <h2 className="text-3xl font-semibold text-center mb-4">To Do List</h2>

      <ul className='space-y-2'>
        {listItems.map((item, index) => (
          <li
            key={item.id}
            className={`w-full flex justify-between items-center bg-zinc-800 hover:bg-zinc-700 p-3 rounded-md transition-all duration-300 ease-in-out transform ${
              deletedId === item.id ? "opacity-0 translate-x-4" : "opacity-100"
            } ${editingId === item.id ? "" : "animate-fadeIn"}`}
          >
            {/* If currently editing this item */}
            {editingId === item.id ? (
              <div className="w-full animate-fadeIn transition-opacity duration-200 ease-out">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <input
                    type="text"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && editText.trim()) {
                        handleSaveEdit(item.id);
                      } 
                    }}
                    className="flex-grow px-3 py-1 rounded bg-zinc-700 text-white ring-2 ring-blue-400 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      disabled={!editText.trim()}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                    >
                      Done
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditText("");
                      }}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full animate-fadeIn transition-opacity duration-200 ease-out flex justify-between items-center">
                <span   
                  className={`flex-1 transition-all duration-300 ease-in-out ${
                  item.completed ? "line-through text-gray-400" : "text-white"
                  }`}
                >
                  {item.text}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggleComplete(index)}
                    className="w-4 h-4 accent-green-400 transform transition-transform duration-200 hover:scale-110"
                  />
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setEditText(item.text);
                    }}
                    className="px-2 py-1 text-white rounded bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(index)}
                    className="px-2 py-1 text-white rounded bg-rose-500 hover:bg-rose-600 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>


      <div className='mt-4'>
        <input type="text" 
          name='to-do' 
          value={newListItem} 
          onChange={e => setNewListItem(e.target.value)} 
          onKeyDown={e => {
            if (e.key === "Enter") handleAddItem();
          }}
          className="flex-grow px-3 py-2 rounded bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 mr-2" 
        />
        <button type="button" 
          onClick={handleAddItem} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200">
          Add
        </button>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-4">
        <button type="button" 
          onClick={handleExport} 
          title="Download your to-do list as a JSON file" 
          disabled={listItems.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50">
          Export Tasks
        </button>
        <button type="button" 
          onClick={handleClearCompleted} 
          disabled={!listItems.some(item => item.completed)} 
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition-colors duration-200">
            Clear Completed Tasks
          </button>
      </div>
      </div>
    </div>
    </>
  )
}

export default App
