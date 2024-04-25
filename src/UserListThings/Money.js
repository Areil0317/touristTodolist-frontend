import React, { useState } from 'react'
import { Row, Col } from 'react-bootstrap';
import Split from './Split';
import Exchange from './Exchange';
import BudgetManage from './BudgetManage';
import { NavLink } from 'react-router-dom';

function Money({ totalAmount, setShowMoney, alldata, selectedTlid, setAllData, update_info }) {
    const [budgetActive, setBudgetActive] = useState(true);
    const [splitActive, setSplitActive] = useState(false);
    const [exchangeActive, setExchangeActive] = useState(false);
    const handleButtonClick = (activeSetter) => {
        // 将所有按钮的状态设置为非活动状态
        setBudgetActive(false);
        setSplitActive(false);
        setExchangeActive(false);
        activeSetter(true);
    }
    const changeMoneyClick = () => {
        setShowMoney(false);
    };

    return (
        <>
            <Row className='' style={{ alignItems: 'center' }}>
                <Row>
                    <Col>
                        <a onClick={changeMoneyClick}><img src='/UserListSource/list.png' style={{ width: "20px", height: '20px', paddingBottom: '0' }} className='m-1' />返回</a>
                    </Col>
                </Row>
                <Row className='m-4'>
                    <Col className='text-center'><p className='text1'>費用管理</p></Col>
                </Row>
                <Row className="m-4 text4" style={{ justifyContent: 'space-between' }}>
                    {/* <Col sm={1}></Col> */}
                    <Col>
                        <NavLink to='/list' className="supportColor text-left">
                            <a onClick={() => handleButtonClick(setBudgetActive)} style={{ borderBottom: budgetActive ? 'solid 3px #80BCBD' : '0px', color: budgetActive ? 'black' : '#939393' }}>預算管理</a>
                        </NavLink>
                    </Col>
                    <Col>
                        <NavLink to='/list' className="supportColor text-right">
                            <a onClick={() => handleButtonClick(setSplitActive)} style={{ borderBottom: splitActive ? 'solid 3px #80BCBD' : '0px', color: splitActive ? 'black' : '#939393' }}>分帳計算</a>
                        </NavLink>
                    </Col>
                    {/* <Col>
                        <NavLink to='/list' className="supportColor text-right">
                            <a onClick={() => handleButtonClick(setExchangeActive)} style={{ borderBottom: exchangeActive ? 'solid 3px #80BCBD' : '0px', color: exchangeActive ? 'black' : '#939393' }}>匯率計算</a>
                        </NavLink>
                    </Col> */}
                    {/* <Col sm={1}></Col> */}
                </Row>
                {budgetActive && <BudgetManage totalAmount={totalAmount} alldata={alldata} selectedTlid={selectedTlid} setAllData={setAllData}/>}
                {splitActive && <Split alldata={alldata} selectedTlid={selectedTlid} setAllData={setAllData} update_info={update_info}/>}
                {/* {exchangeActive && <Exchange />} */}
            </Row>


        </>
    )
}

export default Money