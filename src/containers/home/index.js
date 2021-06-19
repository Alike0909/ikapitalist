import React, { useEffect, useState } from 'react'
import Header from '../../components/header'
import Main from '../../components/main'
import Invest from '../invest'
import Cash from '../cash'
import Сurrency from '../currency'
import './index.css'
import axios from 'axios'

import firebase from 'firebase/app'
import 'firebase/firestore'
import firebaseConfig from "../../firebaseConfig";
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore();

function Home() {

    var thousandSeparator = function (str) {
        var parts = (str + '').split('.'),
            main = parts[0],
            len = main.length,
            output = '',
            i = len - 1;
        while (i >= 0) {
            output = main.charAt(i) + output;
            if ((len - i) % 3 === 0 && i > 0) {
                output = ' ' + output;
            }
            --i;
        }
        if (parts.length > 1) {
            output += '.' + parts[1];
        }
        return output;
    };

    var getAllInvested = function (str) {
        var temp = []
        for (var i in str) {
            temp.push(str[i].data().invested);
        }
        return temp.reduce((a, b) => a + b, 0)
    };

    var getAllIncome = function (str) {
        var temp = []
        for (var i in str) {
            temp.push(str[i].data().invested * Number(str[i].data().profitability.slice(0, -1)) / 1200);
        }
        return temp.reduce((a, b) => a + b, 0)
    };

    const [cash, setCash] = useState([])
    const [currency, setCurrency] = useState([])
    const [invest, setInvest] = useState([])
    const [convertData, setConvertData] = useState([])
    const currencies = [ convertData.CNY, convertData.USD, convertData.KZT ]  
    // currencies ЭТО ПРЯМ ОЧЕНЬ ВАЖНО!!

    async function fetchCash() {
        let data = await db.collection("cash").get()
        setCash(data.docs)
    }

    async function fetchCurrency() {
        let data = await db.collection("currency").get()
        setCurrency(data.docs)
    }

    async function fetchInvest() {
        let data = await db.collection("investments").get()
        setInvest(data.docs)
    }

    const convert = (from, to) => {
        return (currencies[to] / currencies[from])
    }

    useEffect(() => {
        fetchCash()
        fetchCurrency()
        fetchInvest()
        axios.get(`http://api.exchangeratesapi.io/v1/latest?access_key=329ed469fb9d0b86f01272b4ba881944`).then(res => setConvertData(res.data.rates))
    }, [])

    return (
        <div className="home">
            <Header db={db} fetchCash={fetchCash} fetchCurrency={fetchCurrency} fetchInvest={fetchInvest} convert={convert} cash={cash} currency={currency} thousandSeparator={thousandSeparator}></Header>
            <Main db={db} convert={convert} getAllIncome={getAllIncome} getAllInvested={getAllInvested} thousandSeparator={thousandSeparator} cash={cash} invest={invest} currency={currency}></Main>
            <Cash db={db} fetchCash={fetchCash} thousandSeparator={thousandSeparator} cash={cash} setCash={setCash}></Cash>
            <Сurrency db={db} convert={convert} thousandSeparator={thousandSeparator} currency={currency} setCurrency={setCurrency}></Сurrency>
            <Invest db={db} thousandSeparator={thousandSeparator} invest={invest} setInvest={setInvest}></Invest>
        </div>
    );
}

export default Home