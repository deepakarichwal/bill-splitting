import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);

  const [addFriend, setAddFriend] = useState(initialFriends);

  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(newFriend) {
    setAddFriend((friends) => [...friends, newFriend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend(friend);
  }

  function handleSplitBill(value) {
    setAddFriend((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  // console.log(selectedFriend);
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          addFriend={addFriend}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        ></FriendsList>

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          key={selectedFriend.id}
          onHandleSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ addFriend, onSelection, selectedFriend }) {
  const friends = addFriend;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${friend.balance}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {friend === selectedFriend ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id: id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <>
      <form className="form-add-friend" onSubmit={handleSubmit}>
        <label>🙋Friend name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>🖼️Image URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <Button>Add</Button>
      </form>
    </>
  );
}

function FormSplitBill({ selectedFriend, onHandleSplitBill }) {
  const [billValue, setBillValue] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const paidByFriend = billValue ? billValue - userExpense : "";
  const [payBill, setPayBill] = useState("user");

  function handleForm(e) {
    e.preventDefault();

    if (!billValue || !userExpense) return;
    onHandleSplitBill(payBill === "user" ? paidByFriend : -userExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleForm}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰Bill value</label>
      <input
        type="text"
        value={billValue}
        onChange={(e) => setBillValue(Number(e.target.value))}
      />

      <label>🙎Your Expense</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          setUserExpense(
            Number(e.target.value) > billValue
              ? userExpense
              : Number(e.target.value)
          )
        }
      />

      <label>👦{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🙋Who is paying the bill?</label>
      <select value={payBill} onChange={(e) => setPayBill(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
