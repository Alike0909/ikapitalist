import React, {useEffect, useState} from 'react'
import './index.css'

function Currency(props) {

    const {db} = props
    const { thousandSeparator } = props
    const { currency, setCurrency } = props
    const { convert } = props

    const currencyItems = currency.map((item, i) => 
        <div className="currency-item" key={i}>
            <p>{i + 1}</p>
            <p style={{ width: '20%' }}>{item.data().name}</p>
            <p>{item.data().type}</p>
            <p>{item.data().term}</p>
            <p>{item.data().profitability}</p>
            <p style={{ fontWeight: 'bold', width: '32%' }}>{thousandSeparator(item.data().invested.toFixed(2))} {item.data().sign} ≈ {(item.data().invested * convert(i, 2)).toFixed(2)} ₸</p>
            {/* <p>{thousandSeparator(item.data().invested * Number(item.data().profitability.slice(0, -1)) / 1200)} {item.data().sign}/мес</p> */}
        </div>
    )

    return (
        <div className="currency">
            <span>Валюта</span>
            {currencyItems}
        </div>
    );
}

export default Currency