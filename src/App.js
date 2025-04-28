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

export default function App() {
  const [friendslist, setFriendslist] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleClick() {
    setShowAddFriend((x) => !x);
  }

  function handleSplitBill(value) {
    setFriendslist(
      friendslist.map((x) =>
        x.id === selectedFriend.id ? { ...x, balance: x.balance + value } : x
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          setShowAddFriend={setShowAddFriend}
          selectedFriend={selectedFriend}
          onSelection={setSelectedFriend}
          setSelectedFriend={setSelectedFriend}
          friends={friendslist}
        />{" "}
        {showAddFriend && (
          <FormAddFriend
            setShowAddFriend={setShowAddFriend}
            addFriend={setFriendslist}
          />
        )}
        <Button onclick={handleClick}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({
  setSelectedFriend,
  selectedFriend,
  friends,
  onSelection,
  setShowAddFriend,
}) {
  return (
    <ul>
      {friends.map((x) => (
        <Friend
          setShowAddFriend={setShowAddFriend}
          setSelectedFriend={setSelectedFriend}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
          friend={x}
          key={x.id}
        ></Friend>
      ))}
    </ul>
  );
}

function Friend({
  setShowAddFriend,
  setSelectedFriend,
  selectedFriend,
  friend,
  onSelection,
}) {
  const isSelected = selectedFriend?.id === friend.id;
  function handleClick() {
    onSelection(friend);
    if (selectedFriend) setSelectedFriend(null);
    setShowAddFriend(false);
  }
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>{friend.name} and you are even</p>}
      <Button onclick={handleClick}>{isSelected ? "Close" : "Select"}</Button>
    </li>
  );
}

function Button({ children, onclick }) {
  return (
    <button onClick={onclick} className="button">
      {children}
    </button>
  );
}

function FormAddFriend({ setShowAddFriend, addFriend }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState("https://i.pravatar.cc/48");

  function handleNameChange(e) {
    setName(e.target.value);
  }
  function handleImgChange(e) {
    setImg(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();

    if (name === "") return;
    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${img}?=${id}`,
      balance: 0,
    };

    setName("");
    setImg("https://i.pravatar.cc/48");
    addFriend((x) => [...x, newFriend]);
    setShowAddFriend((x) => !x);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input type="text" value={name} onChange={handleNameChange}></input>
      <label>Image URL</label>
      <input
        type="text"
        value={img}
        disabled
        onChange={handleImgChange}
      ></input>
      <Button>Add </Button>
    </form>
  );
}

function FormSplitBill({ onSplitBill, selectedFriend }) {
  const [bill, setBill] = useState("");
  const [myExpence, SetMyExpense] = useState("");
  const [whoSPaying, setWhoSPaying] = useState("user");
  const friendsExpense = bill - myExpence;
  let value = whoSPaying === "user" ? friendsExpense : -friendsExpense;

  function handleSubmit(e) {
    e.preventDefault();
    onSplitBill(value);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label> Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />
      <label> Your Expense</label>
      <input
        type="text"
        value={myExpence}
        onChange={(e) =>
          SetMyExpense(
            Number(e.target.value) > bill ? myExpence : Number(e.target.value)
          )
        }
      />
      <label> {selectedFriend.name}'s Expense</label>
      <input type="text" disabled value={friendsExpense} />
      <label>Who is Paying the Bill</label>
      <select
        value={whoSPaying}
        onChange={(e) => setWhoSPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
