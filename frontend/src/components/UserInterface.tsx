import React, { use, useEffect, useState } from 'react'
import axios from 'axios'
import { CardComponents } from './CardComponents'
import {Users} from '@/libs/types';
import { CamelCase } from '@/libs/utils';


interface UserInterfaceProps{
    backendName: string;
}

export const UserInterface: React.FC<UserInterfaceProps> = ({backendName}) => {
const apiUri = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const [users, setUsers] = useState<Users[]>([]);
const [newUsers, setNewUser ] = useState({name:'', email:''});
const [updateUser,setUpdateUser] = useState({id:'',name:'', email:''});

const backgroundColors : {[key: string]: string} ={
    flask: 'bg-blue-500',
}

const buttonColors : {[key: string]: string} ={
    flask: 'bg-blue-700 hover:bg-blue-600',
}

const bgColor = backgroundColors[backendName as keyof typeof backgroundColors] || 'bg-gray-200'
const btnColor = buttonColors[backendName as keyof typeof buttonColors] || 'bg-gray-500 hover:bg-gray-600';

// Fetch users
useEffect(() => {
const fetchData = async (cacheTime?: number) => {
    try{
        const url = new URL(`${apiUri}/api/${backendName}/users`);
        const options: RequestInit = {
            method: "GET",
            
            next: {
              revalidate: cacheTime || 60 * 60 * 24,
            },
          };
        
          const response = await fetch(url.toString(), options);
          const data = (await response.json());
          setUsers(data.reverse());
    //    const response = await axios.get(`${apiUri}/api/${backendName}/users`)
    //    setUsers(response.data.reverse())
    }catch(err){
        console.log('error fetching data', err)
        
    }
}
fetchData();
}, [backendName,apiUri]);

// Create user
const createUser = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${apiUri}/api/${backendName}/users`, newUsers);
        setUsers([response.data, ...users]);
        setNewUser({ name: '', email: '' });
      } catch (error) {
        console.error('Error creating user:', error);
      }
}

// update user
const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`${apiUri}/api/${backendName}/users/${updateUser.id}`, { name: updateUser.name, email: updateUser.email });
      setUpdateUser({ id: '', name: '', email: '' });
      setUsers(
        users.map((user) => {
          if (user.id === parseInt(updateUser.id)) {
            return { ...user, name: updateUser.name, email: updateUser.email };
          }
          return user;
        })
      );
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

   // Delete user
   const deleteUser = async (userId: number) => {
    try {
      await axios.delete(`${apiUri}/api/${backendName}/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };


return (
<div className={`user-interface ${bgColor} ${backendName} w-full max-w-full p-4 rounded shadow`}>
<img src={`/${backendName}logo.svg`} alt={`${backendName} Logo`} className="w-20 h-20 mb-6 mx-auto" />
<h2 className='text-xl font-bold text-center text-white mb-6'>{`${CamelCase(backendName)} Backend`} </h2>
{/* Create user */}
<form onSubmit={createUser} className="mb-6 p-4 bg-blue-100 rounded shadow md:mx-52">
        <input
          placeholder="Name"
          value={newUsers.name}
          onChange={(e) => setNewUser({ ...newUsers, name: e.target.value })}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <input
          placeholder="Email"
          value={newUsers.email}
          onChange={(e) => setNewUser({ ...newUsers, email: e.target.value })}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          Add User
        </button>
      </form>


  {/* Update user */}
  <form onSubmit={handleUpdateUser} className="mb-6 p-4 bg-blue-100 rounded shadow md:mx-52">
        <input
          placeholder="User Id"
          value={updateUser.id}
          onChange={(e) => setUpdateUser({ ...updateUser, id: e.target.value })}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <input
          placeholder="Name"
          value={updateUser.name}
          onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <input
          placeholder="Email"
          value={updateUser.email}
          onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600">
          Update User
        </button>
      </form>

{/* Display users */}

<div className='flex flex-wrap justify-center gap-10'>
    {users.map(user=> (
        <div key={user.id} className='flex items-center justify-between bg-white p-4 max-w-md '>
            <CardComponents card={user}/>
            <button onClick={() => deleteUser(user.id)} className={`${btnColor} text-white py-2 px-4 rounded`}>
                Delete user
            </button>
        </div>
    ))}
</div>
</div>
);
}