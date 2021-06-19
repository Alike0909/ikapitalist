import React, { useEffect, useState }  from 'react'
import axios from 'axios'
import './index.css'

function Main(props) {

    const { db } = props
    const { thousandSeparator, getAllInvested, getAllIncome } = props
    const { convert } = props
    const { cash, invest, currency } = props

    return (
        <section className="main">
            <div className="main-secondary">
                <span>Пассивный доход</span>
                <h1>{thousandSeparator((getAllIncome(invest) + getAllIncome(cash)).toFixed(2))} ₸ / месяц</h1>
            </div>
            <div className="main-first">
                <span>Общий Капитал</span>
                <h1>{thousandSeparator((getAllInvested(invest) + getAllInvested(cash)).toFixed(2))} ₸</h1>
            </div>
            <div className="main-secondary">
                <span>Курс Валют</span>
                <h1>Юань: {convert(0, 2).toFixed(2)} ₸</h1>
                <h1>Доллар: {convert(1, 2).toFixed(2)} ₸</h1>
            </div>
        </section>
    );
}

export default Main