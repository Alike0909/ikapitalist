import React, { useState, useEffect } from 'react'
import { Modal, Button, Input, Select } from 'antd';
import 'antd/dist/antd.css'
import './index.css'

function Header(props) {

    const {db} = props
    const { thousandSeparator } = props
    const {cash} = props
    const {currency} = props
    const { fetchCash, fetchCurrency, fetchInvest } = props
    const { convert } = props
    
    const [post, setPost] = useState({ name: ``, type: ``, term: ``, profitability: ``, providing: ``, additionals: ``, invested: 0, sign: '₸' })
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [warning, setWarning] = useState(``)

    const onChange = event => {
        if (event.target.name == "invested") {
            if (Number(event.target.value) <= Number(cash[0]?.data().invested)) {
                setPost(prev => ({
                    ...prev,
                    [event.target.name]: Number(event.target.value)
                }))
                setWarning(``)
            } else {
                setWarning('Недостаточно средств!')
            }
        } else {
            setPost(prev => ({
                ...prev,
                [event.target.name]: event.target.value
            }))
        }
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if (warning == null || warning == ``) {
            db.collection("investments").add(
                post
            )
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
            setIsModalVisible(false);
            setPost({ name: ``, type: ``, term: ``, profitability: ``, secured: ``, additionals: ``, invested: ``  })
            fetchInvest()
        } else {
            console.log("puk")
            console.log(warning)
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const returnData = (id) => {
        for (let i in currency) {
            if (currency[i].data().value == id) {
                return { id: currency[i].id, data: currency[i].data(), name: 'currency' }
            }
        }
        for (let i in cash) {
            if (cash[i].data().value == id) {
                return { id: cash[i].id, data: cash[i].data(), name: 'cash' }
            }
        }
    }
    // returnData ЭТО ПРЯМ ОЧЕНЬ ВАЖНО!!

    const [isTransferVisible, setIsTransferVisible] = useState(false);
    const [transferDisabled, setTransferDisabled] = useState({phrase: 'изменить', isDisabled: true});
    const [convertCurrency, setConvertCurrency] = useState('')
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [optionAmount, setOptionAmount] = useState(0)
    const [optionSign, setOptionSign] = useState('')
    const [amount, setAmount] = useState('')
    const { Option } = Select;

    const cashOptions = cash.map((item, i) => 
        <Option amount={item.data().invested} sign={item.data().sign} value={item.data().value} key={item.data().value}>{item.data().name}</Option>
    )

    const currencyOptions = currency.map((item, i) =>
        <Option amount={item.data().invested} sign={item.data().sign}  value={item.data().value} key={item.data().value}>{item.data().name}</Option>
    )

    const showTransfer = () => {
        setIsTransferVisible(true);
    };

    const handleTransferOk = () => {
        if (warning == null || warning == ``) {
            db.collection(returnData(from).name).doc(returnData(from).id).update({
                "invested": Number(returnData(from).data.invested) - Number(amount),
            })
            .then(() => {
                console.log("Document FROM successfully updated!");
            });

            db.collection(returnData(to).name).doc(returnData(to).id).update({
                "invested": Number(returnData(to).data.invested) + Number(amount * convertCurrency),
            })
            .then(() => {
                console.log("Document TO successfully updated!");
            });
            setIsTransferVisible(false);
            fetchCash()
            fetchCurrency()
        } else {
            console.log("puk")
        }
    };

    const handleTransferCancel = () => {
        setIsTransferVisible(false);
    };

    const handleChangeFrom = (value, option) => {
        setAmount(0)
        setOptionAmount(option.amount)
        setOptionSign(option.sign)
        setConvertCurrency(convert(value, to))
        setFrom(value)
    }

    const handleChangeTo = (value) => {
        setAmount(0)
        setConvertCurrency(convert(from, value))
        setTo(value)
    }

    const handleChangeCurrency = (e) => {
        setConvertCurrency(e.target.value)
    }

    const changeDisabled = () => {
        transferDisabled.isDisabled ? setTransferDisabled({ phrase: 'сохранить', isDisabled: false }) : setTransferDisabled({ phrase: 'изменить', isDisabled: true })
    }

    const handleChangeAmount = (event) => {
        if (Number(event.target.value) <= Number(optionAmount)) {
            setAmount(event.target.value)
            setWarning(``)
        } else {
            setWarning('Недостаточно!')
        }
    }

    return (
        <header>
            <div>
                <Button onClick={showTransfer}>Совершить Перевод</Button>
            </div>
            <div>
                <Button>Транзакции</Button>
            </div>
            <div>
                <Button onClick={showModal}>Добавить Инвестицию</Button>
            </div>
            <Modal title="Добавить Инвестиционный проект" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Input value={post.name} name={'name'} onChange={onChange} placeholder="Имя проекта" />
                <Input value={post.type} name={'type'} onChange={onChange} placeholder="Инструмент" />
                <Input value={post.term} name={'term'} onChange={onChange} placeholder="Cрок" />
                <Input value={post.profitability} name={'profitability'} onChange={onChange} placeholder="Ставка" />
                <Input value={post.providing} name={'providing'} onChange={onChange} placeholder="Обеспечение" />
                <Input value={post.additionals} name={'additionals'} onChange={onChange} placeholder="Доп. условия" />
                <Input value={"Свободных средств: " + thousandSeparator(cash[0]?.data().invested) + cash[0]?.data().sign} name={'cash'} placeholder="Свободных средств" disabled/>
                <Input value={post.invested} name={'invested'} onChange={onChange} placeholder="Инвестировано" />
                <p style={{color: 'red'}}>{warning}</p>
            </Modal>
            <Modal title="Совершить Перевод" visible={isTransferVisible} onOk={handleTransferOk} onCancel={handleTransferCancel}>
                <div className="transfer">
                    <p>Откуда:</p>
                    <Select placeholder="выберите" style={{ width: 150 }} onChange={handleChangeFrom}>
                        {cashOptions}
                        {currencyOptions}
                    </Select>
                    <Input value={thousandSeparator(optionAmount) + optionSign} name={'cash'} disabled style={{ width: 150 }} />
                </div>
                <div className="transfer">
                    <p>Куда:</p>
                    <Select placeholder="выберите" style={{ width: 150 }} onChange={handleChangeTo}>
                        {cashOptions}
                        {currencyOptions}
                    </Select>
                </div>
                <div className="transfer">
                    <p style={{ marginRight: 6 }}>Курс:</p>
                    <Input value={convertCurrency} placeholder="курс валют" style={{ width: 150 }} disabled={transferDisabled.isDisabled} onChange={handleChangeCurrency}/>
                    <button onClick={changeDisabled}>{transferDisabled.phrase}</button>
                </div>
                <div className="transfer">
                    <p style={{ marginRight: 6 }}>Сумма:</p>
                    <Input value={amount} placeholder="сумма" style={{ width: 150 }} onChange={handleChangeAmount} />
                    <p style={{ color: 'red', width: 120, margin: 0, fontSize: 16, marginLeft: 12 }}>{warning}</p>
                </div>
                <div className="transfer">
                    <p style={{ marginRight: 6 }}>Получит:</p>
                    <Input value={amount * convertCurrency} placeholder="сумма" style={{ width: 150 }} onChange={handleChangeAmount} disabled/>
                </div>
            </Modal>
        </header>
    );
}

export default Header