import React, { ReactElement } from 'react'

import TableHOC from '../components/admin/TableHOC'
import { Column } from 'react-table'

import { useState } from 'react'
import { Link } from 'react-router-dom'

interface DataType { 
_id : string , 
quantity : number , 
discount : number , 
amount : number , 
status : ReactElement,
action : ReactElement
}


const columns: Column<DataType>[] = [
  {  Header: "ID" , 
    accessor : "_id"} , 
    {  Header: "quantity" , 
    accessor : "quantity"} ,
    {  Header: "discount" , 
    accessor : "discount"} , 
    {  Header: "Total" , 
    accessor : "amount"} ,
    {
        Header:"Status",
        accessor:"status"
    },
    {  Header: "action" , 
    accessor : "action"}

]


const Orders = () => {

    

    const [rows , setRows] = useState<DataType[]>([
        {
            _id : "asd3" ,
             amount : 2000 ,
             discount : 100 ,
             quantity : 2 ,
             status :<p>Processing</p>,
             action : <Link to={`/admin/order/${'asd3'}`}>VIEW</Link>
        } ,
        {
            _id : "asd2" ,
             amount : 3000 ,
             discount : 110 ,
             quantity : 1 ,
             status :<p>Shipped</p>,
             action : <Link to={`/admin/order/${'asd2'}`}>VIEW</Link>
        }
    ])

    const Table = TableHOC<DataType>(
       columns , 
       rows , 
       'dashboard-product-box' , 
       'Orders' , 
      
       rows.length>5
      )();
  return (
   
    <div className='container'>
<h1>ORDERS PLACED</h1>
{Table}
    </div>
  )
}

export default Orders