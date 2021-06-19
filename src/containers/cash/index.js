import React, {useEffect, useState} from 'react'
import { Modal, Select, Input } from 'antd';
import './index.css'

function Cash(props) {

    const {db} = props
    const { thousandSeparator } = props
    const { cash, setCash } = props
    const { fetchCash } = props
    const { Option } = Select;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [operation, setOperation] = useState("put")
    const [amount, setAmount] = useState(0)
    const [warning, setWarning] = useState(``)

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if (warning == null || warning == ``) {
            if (operation == "put") {
                db.collection("cash").doc("dLewcZ1LeHAqLzGeyc08").update({
                    "invested": Number(cash[0].data().invested) + Number(amount),
                })
                .then(() => {
                    console.log("Document successfully updated!");
                });
            } else {
                db.collection("cash").doc("dLewcZ1LeHAqLzGeyc08").update({
                    "invested": Number(cash[0].data().invested) - Number(amount),
                })
                .then(() => {
                    console.log("Document successfully updated!");
                });
            }
            setIsModalVisible(false);
            fetchCash()
        } else {
            console.log("puk")
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    function handleChange(value) {
        setOperation(value)
    }

    const onChange = event => {
        if (operation == "withdraw") {
            if (Number(event.target.value) <= Number(cash[0]?.data().invested)) {
                setAmount(event.target.value)
                setWarning(``)
            } else {
                setWarning('Недостаточно!')
            }
        } else {
            setAmount(event.target.value)
        }
    }

    const cashItems = cash.map((item, i) =>
        <div className="cash-item" key={i} onClick={showModal}>
            <p>{i + 1}</p>
            <p style={{ width: '20%' }}>{item.data().name}</p>
            <p>{item.data().type}</p>
            <p>{item.data().term}</p>
            <p>{item.data().profitability}</p>
            <p style={{ fontWeight: 'bold' }}>{thousandSeparator(item.data().invested.toFixed(2))} {item.data().sign}</p>
            <p>{thousandSeparator((item.data().invested * Number(item.data().profitability.slice(0, -1)) / 1200).toFixed(2))} {item.data().sign}/мес</p>
        </div>
    )

    return (
        <div className="cash">
            <span>Свободные средства</span>
            {cashItems}
            <Modal title="Добавить/Снять из Свободных средств" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <div className="transaction">
                    <Input name={'amount'} onChange={onChange} placeholder="Сумма" style={{ width: 150 }} />
                    <Select defaultValue="put" style={{ width: 150 }} onChange={handleChange}>
                        <Option value="put">Вложить</Option>
                        <Option value="withdraw">Снять</Option>
                    </Select>
                    {operation == "withdraw" ?
                        <Input value={thousandSeparator(cash[0]?.data().invested) + cash[0]?.data().sign} name={'cash'} disabled style={{ width: 150 }} />
                        :
                        ''
                    }
                </div>
                <div className="comment">
                    <Input name={'comment'} placeholder="Комментарий" style={{ width: 306 }} />
                    <p style={{ color: 'red', width: 120, margin: 0 }}>{warning}</p>
                </div>
            </Modal>
        </div>
    );
}

export default Cash