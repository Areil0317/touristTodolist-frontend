import React, { useState, useEffect, useRef } from "react";
import Pic from "./FormThings/Pic";
import Project from "./FormThings/Project";
import Budget from "./FormThings/Budget";
import { BiArrowBack } from "react-icons/bi";
import { Row, Col, Form, Spinner, Carousel } from "react-bootstrap";
import "./color.css";
import TextareaAutosize from "react-textarea-autosize";
import { NavLink } from "react-router-dom";
import Imgitem from "./FormThings/Imgitem";
import { FaImages } from "react-icons/fa";
import RatingComponent from "./RatingComponent";

const API_HOST = process.env.REACT_APP_API_URL;

function RightSide({
    changeMoneyClick,
    selectedjid,
    alldata,
    update_info,
    selectedTlid,
    setAllData,
    setrwdShow,
}) {
    // const [thinkvalue, setThinkValue] = useState('');
    // const [memoValue, setMemoValue] = useState('');
    const [journeyData, setJourneyData] = useState({});
    const [sidebarContent, setSidebarContent] = useState("default");
    const changePhotoClick = () => {
        setSidebarContent("addAlbum"); // 更改側邊欄為新增相簿的介面
    };
    // 重置側邊欄內容為默認的介面
    const resetSidebarContent = () => {
        setSidebarContent("default");
    };
    const think = useRef(null);
    const memo = useRef(null);
    const aname = useRef(null);
    const arrivedDate = useRef(null);
    const arrivedTime = useRef(null);
    const leavedTime = useRef(null);


    useEffect(() => {
        const jid = selectedjid;
        const tlid = selectedTlid;
        const filtereListdData = alldata.filter((item) => item.tlid == tlid);
        const filtereJourneydData = filtereListdData[0].journeys.filter(
            (item) => item.jid == jid
        );
        setJourneyData(filtereJourneydData[0]);
    }, [selectedTlid, alldata, selectedjid]);

    //handle畫面的各種改變
    const handleAnameChange = (event) => {
        setJourneyData({
            ...journeyData,
            attraction: {
                ...journeyData.attraction,
                aname: event.target.value,
            },
        });
    };

    const handleArrivedDateChange = (event) => {
        setJourneyData({
            ...journeyData,
            arrived_date: event.target.value,
        });
    };

    const handleArrivedTimeChange = (event) => {
        let value = event.target.value;
        // 添加秒數
        value += ":00";
        setJourneyData({
            ...journeyData,
            arrived_time: value,
        });
    };

    const handleLeavedTimeChange = (event) => {
        setJourneyData({
            ...journeyData,
            leaved_time: event.target.value,
        });
    };

    const handleJrateChange = (newRating) => {
        setJourneyData({
            ...journeyData,
            jrate: newRating,
        });
    };

    const handleJbnameChange = (event, budgetDatajbid) => {
        setJourneyData((prevJourneyData) => {
            const updatedJbudgets = prevJourneyData.jbudgets.map((item) => {
                if (item.jbid === budgetDatajbid) {
                    return {
                        ...item,
                        jbname: event.target.value,
                    };
                }
                return item;
            });
            return {
                ...prevJourneyData,
                jbudgets: updatedJbudgets,
            };
        });
    };

    const handleJbamountChange = (event, budgetDatajbid) => {
        setJourneyData((prevJourneyData) => {
            const updatedJbudgets = prevJourneyData.jbudgets.map((item) => {
                if (item.jbid === budgetDatajbid) {
                    return {
                        ...item,
                        jbamount: event.target.value,
                    };
                }
                return item;
            });
            return {
                ...prevJourneyData,
                jbudgets: updatedJbudgets,
            };
        });
    };
    //
    const deleteJbamount = (budgetDatajbid) => {
        fetch(API_HOST + "/api/POST/deletejbudget", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jbid: budgetDatajbid,
            }),
        }).then((r) => {
            setAllData((prevAlldata) => {
                return prevAlldata.map((touristList) => {
                    if (touristList.tlid === selectedTlid) {
                        return {
                            ...touristList,
                            journeys: touristList.journeys.map((journey) => {
                                if (journey.jid === journeyData.jid) {
                                    return {
                                        ...journey,
                                        jbudgets: journey.jbudgets.filter((jbudget) => {
                                            return jbudget.jbid !== budgetDatajbid;
                                        }),
                                    };
                                } else {
                                    return journey;
                                }
                            }),
                        };
                    } else {
                        return touristList;
                    }
                });
            });
        });
    };

    const deleteJimage = (imageDatajiid) => {
        fetch(API_HOST + "/api/POST/deletejimage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jiid: imageDatajiid,
            }),
        }).then((r) => {
            setAllData((prevAlldata) => {
                return prevAlldata.map((touristList) => {
                    if (touristList.tlid === selectedTlid) {
                        return {
                            ...touristList,
                            journeys: touristList.journeys.map((journey) => {
                                if (journey.jid === journeyData.jid) {
                                    return {
                                        ...journey,
                                        jimages: journey.jimages.filter((jimages) => {
                                            return jimages.jiid !== imageDatajiid;
                                        }),
                                    };
                                } else {
                                    return journey;
                                }
                            }),
                        };
                    } else {
                        return touristList;
                    }
                });
            });
        });
    };

    const handleUpdateClick = async () => {
        const updateJourneyData = {
            jid: journeyData.jid,
            aname: aname.current.value,
            arrived_date: arrivedDate.current.value,
            arrived_time: arrivedTime.current.value,
            leaved_time: leavedTime.current.value,
            jmemo: memo.current.value,
            jreview: think.current.value,
            jrate: journeyData.jrate,
            jchecked: journeyData.jchecked,
        };
        // 發送 HTTP 請求，將表單數據提交到服務器
        fetch(API_HOST + "/api/POST/updatejourney", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateJourneyData),
        }).then(() => {
            // 發送 HTTP 請求，將費用數據提交到服務器
            journeyData.jbudgets.forEach((item) => {
                fetch(API_HOST + "/api/POST/updatejbudget", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        jbid: item.jbid,
                        jbname: item.jbname,
                        jbamount: item.jbamount,
                    }),
                });
            });
            // update journey_info();
            setAllData((prevAlldata) => {
                return prevAlldata.map((touristList) => {
                    if (touristList.tlid === selectedTlid) {
                        return {
                            ...touristList,
                            journeys: touristList.journeys.map((journey) => {
                                if (journey.jid === journeyData.jid) {
                                    return {
                                        ...journey,
                                        arrived_date: journeyData.arrived_date,
                                        arrived_time: journeyData.arrived_time,
                                        leaved_time: journeyData.leaved_time,
                                        jmemo: memo.current.value,
                                        jreview: think.current.value,
                                        jrate: journeyData.jrate,
                                        jchecked: journeyData.jchecked,
                                        attraction: {
                                            ...journey.attraction,
                                            aname: aname.current.value,
                                        },
                                        jbudgets: journeyData.jbudgets,
                                    };
                                } else {
                                    return journey;
                                }
                            }),
                        };
                    } else {
                        return touristList;
                    }
                });
            });

            //
        });
    };

    const addBudgetClick = () => {
        fetch(API_HOST + "/api/POST/addjbudget", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jid: journeyData.jid,
                jbname: "未命名",
                jbamount: "0",
            }),
        }).then((response) => {
            update_info();
        });
    };

    if (!journeyData || !selectedTlid || !selectedjid || !alldata) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    }

    return (
        <>
            <Row
                className="sticky-top"
                style={{ backgroundColor: "white", zIndex: 2 }}
            >
                <Row className="m-1">
                    <Col className="text-left">
                        {/* <a onClick={changeMoneyClick}><img src='/UserListSource/list.png' style={{ width: "20px", height: '20px', paddingBottom: '0' }} className='m-2' />返回</a> */}
                        <a
                        onClick={()=>{setrwdShow("TwoAreaMiddleXS")}}
                        ><img src='/UserListSource/list.png' style={{ width: "20px", height: '20px', paddingBottom: '0' }} className='m-2' />返回清單</a>
                    </Col>
                </Row>
                {/* <Row> */}
                <Row className="m-1">
                    {/* <Col xs={1}></Col> */}
                    <Col xs={11} className="text-center">
                        {journeyData.attraction && (
                            <Form.Control
                                ref={aname}
                                style={{ borderColor: "transparent" }}
                                className="text1 p-2 m-4 text-center text-truncate"
                                value={journeyData.attraction.aname}
                                onChange={handleAnameChange}
                                type="text"
                                placeholder="請輸入標題"
                                onBlur={handleUpdateClick}
                            />
                        )}
                    </Col>
                    <Col xs={1}></Col>
                </Row>
                <Row className="text-center">
                    <Col xs={1}></Col>
                    <Col xs={3}>
                        <a onClick={changeMoneyClick}>
                            費用管理
                            <img
                                src="/UserListSource/money.png"
                                style={{ width: "20px", height: "20px", paddingBottom: "0" }}
                                className="m-2"
                            />
                        </a>
                    </Col>
                    <Col className="text-right" xs={3}>
                        <NavLink to="/ratings">
                            <a id="ratings">
                            評論與評價
                                <img
                                    src="/UserListSource/comment.png"
                                    style={{ width: "20px", height: "20px", paddingBottom: "0" }}
                                    className="m-2"
                                />
                            </a>
                        </NavLink>
                    </Col>
                    <Col xs={3}>
                        <a onClick={changePhotoClick}>
                            相簿
                            <FaImages
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    paddingBottom: "0",
                                    color: "#939393",
                                }}
                                className="m-2"
                            />
                        </a>
                    </Col>
                    {/* <Col xs={1}></Col> */}
                </Row>
            </Row>
            {sidebarContent === "default" && (
                <div>
                    <Row className="m-4" style={{ alignItems: "center" }}>
                        <Col xs={1}></Col>
                        <Col xs={10}>
                            <Form.Label className="text-left ">出發日期</Form.Label>
                        </Col>
                        <Col xs={1}></Col>

                        <Col xs={1}></Col>
                        <Col className="text-center" xs={10}>
                            <Form.Control
                                ref={arrivedDate}
                                value={journeyData.arrived_date}
                                onChange={handleArrivedDateChange}
                                onBlur={handleUpdateClick}
                                type="date" />
                        </Col>
                        <Col xs={1}></Col>
                    </Row>
                    <Row className="m-4" style={{ alignItems: "center" }}>
                        <Col xs={1}></Col>
                        <Col xs={10}>
                            <Form.Label className="text-left ">時間</Form.Label>
                        </Col>
                        <Col xs={1}></Col>

                        <Col xs={1}></Col>
                        <Col className="text-center" xs={4}>
                            <Form.Control
                                ref={arrivedTime}
                                onChange={handleArrivedTimeChange}
                                onBlur={handleUpdateClick}
                                value={
                                    journeyData.arrived_time != null
                                        ? journeyData.arrived_time
                                        : "00:00:00"
                                }
                                type="time"
                            />
                        </Col>
                        <Col className="text-center m-1">
                            <img
                                src="/UserListSource/to.png"

                                style={{ width: "24px", height: "24px", paddingBottom: "0" }}
                                alt="The next icon"
                            />
                        </Col>
                        <Col className="text-center" xs={4}>
                            <Form.Control
                                ref={leavedTime}
                                onChange={handleLeavedTimeChange}
                                onBlur={handleUpdateClick}
                                value={
                                    journeyData.leaved_time != null
                                        ? journeyData.leaved_time
                                        : "00:00:00"
                                }
                                type="time"
                            />
                        </Col>
                        <Col xs={1}></Col>
                    </Row>

                    {journeyData.jbudgets &&
                        journeyData.jbudgets.map((item, index) => (
                            <Budget
                                deleteJbamount={deleteJbamount}
                                handleJbnameChange={handleJbnameChange}
                                handleJbamountChange={handleJbamountChange}
                                key={index}
                                budgetData={item}
                                handleUpdateClick={handleUpdateClick}
                            />
                        ))}

                    <Row className="m-4" style={{ alignItems: "center" }}>
                        <Col xs={1}></Col>
                        <Col xs={10}>
                            <Row className="text-right">
                                <Col xs={5} className="d-flex align-items-center">
                                    <Form.Label className="text-left">感想</Form.Label>
                                </Col>
                                <Col xs={7} className="d-flex justify-content-end">

                                    <RatingComponent
                                        handleUpdateClick={handleUpdateClick}
                                        handleJrateChange={handleJrateChange}
                                        jRateData={journeyData.jrate}
                                    />


                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <TextareaAutosize
                                        ref={think}
                                        value={journeyData.jreview || ""}
                                        onChange={(event) =>
                                            setJourneyData({
                                                ...journeyData,
                                                jreview: event.target.value,
                                            })
                                        }
                                        placeholder="抒發感想"
                                        className="rounded"
                                        style={{
                                            minRows: "50px",
                                            width: "100%",
                                            padding: ".375rem .75rem",
                                            border:
                                                "var(--bs-border-width) solid var(--bs-border-color)",
                                        }}
                                        onBlur={handleUpdateClick}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={1}></Col>
                    </Row>

                    {/* <Project></Project> */}
                    <Row className="m-4" style={{ alignItems: "center" }}>
                        <Col xs={1}></Col>
                        <Col xs={10}>
                            <Form.Label className="text-left ">備註</Form.Label>
                        </Col>
                        <Col xs={1}></Col>
                        <Col xs={1}></Col>
                        <Col className="text-center" xs={10}>
                            <TextareaAutosize
                                ref={memo}
                                value={journeyData.jmemo || ""}
                                onChange={(event) =>
                                    setJourneyData({ ...journeyData, jmemo: event.target.value })
                                }
                                placeholder="新增備註"
                                className="rounded"
                                style={{
                                    minRows: "50px",
                                    width: "100%",
                                    padding: ".375rem .75rem",
                                    border: "var(--bs-border-width) solid var(--bs-border-color)",
                                }}
                                onBlur={handleUpdateClick}
                            />
                        </Col>
                        <Col xs={1}></Col>
                    </Row>
                    <Row className="m-4" style={{ alignItems: "center" }}>
                        <Col xs={1}></Col>
                        {/* <Col xs={5}>
                    <a>
                        <img className='text-left m-2' style={{ width: "32px", height: '32px' }} src="/UserListSource/add.png" alt="Icon" />
                        <Form.Label className='text-left '>新增項目</Form.Label>
                    </a>
                </Col> */}
                        <Col xs={10}>
                            <button
                                type="button"
                                onClick={addBudgetClick}
                                style={{ border: "none", backgroundColor: "transparent" }}
                            >
                                <img
                                    className="text-left m-2"
                                    style={{ width: "32px", height: "32px" }}
                                    src="/UserListSource/add.png"
                                    alt="Icon"
                                />
                                <Form.Label className="text-left ">新增費用</Form.Label>
                            </button>
                        </Col>
                        {/* <Col sm={1}>
                    <button
                        type="button"
                        onClick={handleUpdateClick}
                        style={{ border: "none", backgroundColor: "transparent" }}
                    >
                        <img
                            src="/UserListSource/send.png"
                            style={{
                                width: "48px",
                                height: "48px",
                                paddingBottom: "0",
                            }}
                            alt="A sent icon"
                        />
                    </button>
                </Col> */}
                        <Col sm={1}></Col>
                    </Row>
                </div>
            )}
            {sidebarContent === "addAlbum" && (
                <>
                    <Row className="m-4" style={{ alignItems: "center" }}>
                        <Row>
                            <a onClick={resetSidebarContent}>
                                <BiArrowBack size={20} style={{ margin: "2px" }} />
                                返回上層
                            </a>
                            <Pic
                                journeyDataJid={journeyData.jid}
                                update_info={update_info}
                            ></Pic>
                        </Row>
                        <Row className="m-4">
                            {/* <Col sm={1}></Col> */}
                            <Col
                                // sm={10}
                                style={{
                                    width: "100%",
                                    height: "400px",
                                    // border: "1px solid gray",
                                    overflowY: "auto",
                                    overflowX: 'hidden'
                                }}
                            >
                                {journeyData.jimages &&
                                    journeyData.jimages.map((item) => (
                                        <Imgitem
                                            key={item.jiid}
                                            jimageData={item}
                                            deleteJimage={deleteJimage}
                                        />
                                    ))}
                            </Col>
                            {/* <Col sm={1}></Col> */}
                        </Row>
                    </Row>
                </>
            )}
        </>
    );
}

export default RightSide;
