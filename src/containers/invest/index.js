import React, {useEffect, useState} from 'react'
import { Modal } from 'antd';
import './index.css'

function Invest(props) {

    const {db} = props
    const { thousandSeparator } = props
    const { invest, setInvest } = props

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [title, setTitle] = useState('')
    const [payments, setPayments] = useState([])

    const showModal = (data) => {
        setTitle(data.name)
        setPayments(data.payments)
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const investItems = invest.map((item, i) =>
        <div className="invest-item" key={i} onClick={() => showModal(item.data())}>
            <p>{i + 1}</p>
            <p style={{width: '20%'}}>{item.data().name}</p>
            <p>{item.data().type}</p>
            <p>{item.data().term} месяцев</p>
            <p>{item.data().profitability}</p>
            <p style={{ fontWeight: 'bold' }}>{thousandSeparator(item.data().invested)} {item.data().sign}</p>
            <p>{thousandSeparator(item.data().invested * Number(item.data().profitability.slice(0, -1)) / 1200)} {item.data().sign}/мес</p>
        </div>
    )

    const paymentItems = payments?.map((item, i) =>
        item.base ?
            <div className={item.paid ? "payment-item paid" : "payment-item"} key={i}>
                <p style={{ width:'30%' }}>Основной долг</p>
                <p>{thousandSeparator(item.base)} ₸</p>
                { item.paid ?
                    <p>Выплачено</p>
                    :
                    <button>Получено</button>
                }
            </div>
            :
            <div className={item.paid ? "payment-item paid" : "payment-item"} key={i}>
                <p style={{ width: '30%' }}>{i+1} месяц</p>
                <p>{thousandSeparator(item.income)} ₸</p>
                {item.paid ?
                    <p>Выплачено</p>
                    :
                    <button>Получено</button>
                }
            </div>
    )

    for( let i in payments ) {
        payments[i].base ? console.log(true) : console.log(false)
    }

    return (
        <div className="invest">
            <span>Инвестиции</span>
            {investItems}
            <Modal title={title} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null} >
                {paymentItems}
            </Modal>
        </div>
    );
}

export default Invest