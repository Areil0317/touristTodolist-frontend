import React, { useState, useEffect, useRef } from "react";
import JourneyProject from "./JourneyProject";
import Journey from "./Journey";
import "./color.css";
import { Row, Col, Form, Spinner } from "react-bootstrap";
import Day from "./Day";
import { NavLink } from "react-router-dom";

const API_HOST = process.env.REACT_APP_API_URL;


function JourneyList({ listdata, journeys, onFocusJourneyProject, setSelectedJourneyData, update_info, onFocusJourney, setShowJourney, onRemoveJourney, setOutOfTheJourney, setIsSearchAttractionProjectsDataChosen }) {
  const journeyListRef = useRef(null);
  const { start_date, end_date } = listdata;
  const dateArray = getDatesArray(start_date, end_date);
  const [hiddenJourneys, setHiddenJourneys] = useState({});



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'BUTTON' &&
        event.target.tagName !== "IMG" && !event.target.classList.contains('isjourney')
      ) {
        if (journeyListRef.current && !journeyListRef.current.contains(event.target)) {
          console.log('You clicked outside of journey list!');
          setOutOfTheJourney(true);
        } else {
          setOutOfTheJourney(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [journeyListRef]);


  function getDatesArray(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
      dates.push(new Date(currentDate).toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  function toggleJourneys(date) {
    setHiddenJourneys(prevHiddenJourneys => ({
      ...prevHiddenJourneys,
      [date]: !prevHiddenJourneys[date],
    }));
  }

  function setrwdShow() {

  }

  if (!journeys) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }
  // return journeys.map((item, index) => <p key={index}>{JSON.stringify(item)}</p> )
  const journeysInDateRange = journeys.filter(journey => dateArray.includes(journey.arrived_date));
  const journeysOutsideDateRange = journeys.filter(journey => !dateArray.includes(journey.arrived_date));

  return (
    <div ref={journeyListRef}>
      {dateArray.map((date, index) => (
        <React.Fragment key={index}>
          <Day date={date} toggleJourneys={toggleJourneys} hidden={hiddenJourneys[date]} listdata={listdata} />
          {!hiddenJourneys[date] && journeysInDateRange
            .filter(journey => journey.arrived_date === date)
            .sort((a, b) => {
              const timeA = a.arrived_time.split(':').reduce((acc, cur) => acc * 60 + +cur, 0);
              const timeB = b.arrived_time.split(':').reduce((acc, cur) => acc * 60 + +cur, 0);
              if (timeA < timeB) {
                return -1;
              } else if (timeA > timeB) {
                return 1;
              } else {
                return 0;
              }
            })
            .map((item, index) => (
              <Journey
                key={index}
                journeydata={item}
                update_info={update_info}
                onFocusJourney={onFocusJourney}
                setShowJourney={setShowJourney}
                onRemoveJourney={onRemoveJourney}
                onFocusJourneyProject={onFocusJourneyProject}
                setSelectedJourneyData={setSelectedJourneyData}
                setrwdShow={setrwdShow}
                setIsSearchAttractionProjectsDataChosen={setIsSearchAttractionProjectsDataChosen}
              />
            ))}
        </React.Fragment>
      ))}
      {journeysOutsideDateRange.map((journey, index) => (
        <React.Fragment key={index}>
          <Day date={journey.arrived_date} hidden={hiddenJourneys[journey.arrived_date]} showDayIndex={false} listdata={listdata} />
          <Journey
            key={index}
            journeydata={journey}
            update_info={update_info}
            onFocusJourney={onFocusJourney}
            setShowJourney={setShowJourney}
            onRemoveJourney={onRemoveJourney}
            onFocusJourneyProject={onFocusJourneyProject}
            setSelectedJourneyData={setSelectedJourneyData}
            setrwdShow={setrwdShow}
            setIsSearchAttractionProjectsDataChosen={setIsSearchAttractionProjectsDataChosen}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

function TotalCost({ costData, setTotalAmount }) {
  const [totalAmountForTwoAreaMiddle, setTotalAmountForTwoAreaMiddle] = useState('');

  useEffect(() => {
    const jTotalAmount = costData.journeys.reduce((acc, item) => {
      if (item.jbudgets) {
        return (
          acc +
          item.jbudgets.reduce((sum, budgetItem) => {
            return sum + Number(budgetItem.jbamount);
          }, 0)
        );
      }
      return acc;
    }, 0);

    const jpTotalAmount = costData.journeys.reduce((acc, journey) => {
      if (journey.journey_projects) {
        const projectTotal = journey.journey_projects.reduce((sum, project) => {
          if (project.jpbudgets) {
            return (
              sum +
              project.jpbudgets.reduce((total, budget) => {
                return total + Number(budget.jpbamount);
              }, 0)
            );
          }
          return sum;
        }, 0);
        return acc + projectTotal;
      }
      return acc;
    }, 0);

    const totalAmount = jTotalAmount + jpTotalAmount;
    setTotalAmount(totalAmount);
    setTotalAmountForTwoAreaMiddle(totalAmount.toLocaleString())

  }
    , [costData])


  if (!costData || !costData.journeys || !totalAmountForTwoAreaMiddle) {
    return <div>總共：0元</div>;
  }

  return <div>總共：{totalAmountForTwoAreaMiddle}元</div>;

}


//顯示搜尋結果元件//
function Attraction({ attractionData, setSearchAttractionsDataValue }) {

  return (
    <>
      <Col sm={10}
        onClick={() => { setSearchAttractionsDataValue(attractionData.aname) }}
        className='searchThings rounded p-3 text-center' style={{ borderColor: 'transparent' }}
      >
        <div
        >
          {attractionData.aname}
        </div>
      </Col>
      <Col sm={2}></Col>
    </>
  )
}

function Project({ projectData, setSearchAttractionProjectDataValue, }) {

  return (
    <div
      className="isjourney"
    >
      <Col sm={10}
        onClick={() => { setSearchAttractionProjectDataValue(projectData.pname) }}
        name="project"
        className='searchThings rounded p-3 text-center isjourney' style={{ borderColor: 'transparent' }}
      >
        <div
          className="isjourney"
        >
          {projectData.pname}
        </div>
      </Col>
      <Col sm={2}></Col>
    </div>
  )
}
/////

function TwoAreaMiddle({ setAllData, selectedTlid, selectedjid, alldata, update_info, onFocusJourney, setTotalAmount, setShowJourney, onFocusJourneyProject }) {
  const [listdata, setListdata] = useState({
  });
  const [searchJourneyValue, setSearchJourneyValue] = useState('');
  const [searchJourneyProjectValue, setSearchJourneyProjectValue] = useState('');
  const [outOfTheJourney, setOutOfTheJourney] = useState(true);

  const [selectedJourneyData, setSelectedJourneyData] = useState({});


  const [searchAttractionsData, setSearchAttractionsData] = useState([]);
  const [searchAttractionProjectsData, setSearchAttractionProjectsData] = useState([]);

  const [isSearchAttractionsDataChosen, setIsSearchAttractionsDataChosen] = useState(false);
  const [isSearchAttractionProjectsDataChosen, setIsSearchAttractionProjectsDataChosen] = useState(false);


  const titleName = useRef(null);
  const startDate = useRef(null);
  const endDate = useRef(null);


  // 過濾出 tlid 為特定值的資料
  useEffect(() => {
    const tlid = selectedTlid;
    const filteredData = alldata.filter((item) => item.tlid == tlid);
    console.log(filteredData[0]);
    setListdata(filteredData[0]);
  }, [selectedTlid, alldata]);



  //清單時間日期相關

  const handleStartDateChange = (event) => {
    setListdata({
      ...listdata,
      start_date: event.target.value,
    });
  };

  const handleEndDateChange = (event) => {
    setListdata({
      ...listdata,
      end_date: event.target.value,
    });
  };

  const handleUpdateListClick = async () => {
    const updateListData = {
      tlid: selectedTlid,
      title: titleName.current.value,
      start_date: startDate.current.value,
      end_date: endDate.current.value,
      totalamount: listdata.totalamount,
      tlphoto: listdata.tlphoto,
    };

    const token = localStorage.getItem("userToken");

    fetch(API_HOST + "/api/POST/updatelist",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateListData),
      }
    )
      .then((response) => {
        console.log(response)
        //update list_info();
        setAllData(prevAlldata => {
          return prevAlldata.map(
            (touristList) => {
              if (touristList.tlid === selectedTlid) {

                return {
                  ...touristList,
                  title: titleName.current.value,
                  start_date: startDate.current.value,
                  end_date: endDate.current.value,
                  totalamount: listdata.totalamount,
                  tlphoto: listdata.tlphoto,
                }


              } else {
                return touristList
              }


            }
          )
        }
        )
        //

      })


  };


  //輸入時查詢景點資料
  const handleSearchAttraction = async (event) => {
    setSearchJourneyValue(event.target.value)
    setIsSearchAttractionsDataChosen(false)

    fetch(API_HOST + "/api/POST/searchsimilarattraction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aname: event.target.value
      }),
    }).then((response) => {
      return response.json();
    }).then((data) => {

      setSearchAttractionsData(data);
      console.log(data);

    }).catch((error) => {
      console.error("Error:", error);
    });

  }
  //點擊選擇後讓搜尋結果消失
  const setSearchAttractionsDataValue = async (attractionDataAname) => {
    setSearchJourneyValue(attractionDataAname)
    setIsSearchAttractionsDataChosen(true)
  }

  //輸入時查詢項目資料
  const handleSearchAttractionProject = async (event) => {
    // setSearchJourneyProjectValue(event.target.value)
    console.log(selectedJourneyData);
    setIsSearchAttractionProjectsDataChosen(false)

    fetch(API_HOST + "/api/POST/searchproject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aid: selectedJourneyData.attraction.aid
      }),
    }).then((response) => {
      return response.json();
    }).then((data) => {

      setSearchAttractionProjectsData(data);
      console.log(data);

    }).catch((error) => {
      console.error("Error:", error);
    });

  }
  //點擊選擇後讓項目搜尋結果消失
  const setSearchAttractionProjectDataValue = async (projectDataPname) => {
    setSearchJourneyProjectValue(projectDataPname)
    setIsSearchAttractionProjectsDataChosen(true)
  }



  //送出景點資料成為行程

  const handleSearchJourneyClick = async () => {
    const addjourneydata = {
      tlid: selectedTlid,
      aname: searchJourneyValue
    };
    // 發送 HTTP 請求，將表單數據提交到服務器
    fetch(API_HOST + "/api/POST/addjourney", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addjourneydata),
    }).then((response) => {
      setSearchJourneyValue("");
      console.log(response.json());
      update_info();
    });
  };

  //送出項目資料成為行程項目

  const handleSearchJourneyProjectClick = async () => {
    console.log(selectedjid)
    console.log(searchJourneyProjectValue)

    const addjourneyProjectdata = {
      jid: selectedjid,
      pname: searchJourneyProjectValue
    };
    // 發送 HTTP 請求，將表單數據提交到服務器
    fetch(API_HOST + "/api/POST/addjourneyproject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addjourneyProjectdata),
    }).then((response) => {
      setSearchJourneyProjectValue("")
      console.log(response.json());
      update_info();
    });
  };

  //改title名
  // 監聽滑鼠點擊事件
  function handleClickOutside(event) {
    // 檢查點擊事件是否發生在input元素之外
    if (titleName.current && !titleName.current.contains(event.relatedTarget)) {
      const inputValue = titleName.current.value;
      console.log(inputValue);
      const token = localStorage.getItem("userToken");
      fetch(`${API_HOST}/api/POST/updatelist`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tlid: selectedTlid,
          title: inputValue,
          start_date: listdata.start_date,
          end_date: listdata.end_date
        }),
      }).then(() => {
        update_info();
      });
    }
  }
  // 將滑鼠點擊事件添加到document上

  // 監聽input的改變事件
  const handleTitleChange = (event) => {
    setListdata({
      ...listdata,
      title: event.target.value,
    });
  };




  const onRemoveJourney = (selectedjid) => {
    // 找到要刪除的 tlid 所在的索引
    const index = listdata.journeys.findIndex((item) => item.jid === selectedjid);
    // 使用 filter() 方法過濾出除了被刪除的 tlid 外的其他 tlid
    const otherjids = listdata.journeys.filter((item, i) => i !== index).map((item) => item.jid);
    // 調用 onSelect() 函式來切換到其他的 tlid 清單
    if (otherjids.length > 0) {
      onFocusJourney(otherjids[0]);
    }

    fetch(`${API_HOST}/api/POST/deletejourney`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jid: selectedjid
      })
    })
      .then(() => {
        update_info();
      })
      ;
  }





  if (!listdata || !selectedTlid) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <>
      <Row className="sticky-top bg-color4">
        <Row className="m-4 justify-content-end">
          {/* <Col xs={1}></Col> */}
          <Col sm={11} xs={10} className="text-center">
            <Form.Control
              ref={titleName}
              value={listdata.title}
              className="text1 p-2 m-4 bg-color4 text-center text-truncate"
              style={{ borderColor: "transparent" }}
              placeholder="請輸入標題"
              onChange={handleTitleChange}
              onBlur={handleUpdateListClick}
              type="text"
            />
          </Col>
          <Col sm={1} xs={2}></Col>
        </Row>
        <Row className="m-4 d-xs-none">
          <Col className="text-center">
            <TotalCost costData={listdata} setTotalAmount={setTotalAmount} />
          </Col>
        </Row>
        <Row className="mt-4 d-sm-none">
          <Col className="text-center">
            <TotalCost costData={listdata} setTotalAmount={setTotalAmount} />
          </Col>
          <Col className="text-center" sm={2}>
            <NavLink to="/prelist">
              <a id="prelist">
                <img
                  src="/UserListSource/bag.png"
                  style={{ width: "20px", height: "20px", paddingBottom: "0" }}
                  className="m-2"
                />
                行前清單
              </a>
            </NavLink>
          </Col>
        </Row>
        <Row className="m-4" style={{ alignItems: "center" }}>
          {/* <Col sm={1}></Col> */}
          <Col className="text-center" sm={5} xs={5}>
            <Form.Control ref={startDate} value={listdata.start_date} type="date" onChange={handleStartDateChange} onBlur={handleUpdateListClick} />
          </Col>
          <Col className="text-center" sm={1} xs={1}>
            <img
              src="/UserListSource/to.png"
              style={{ width: "24px", height: "24px", paddingBottom: "0" }}
              alt="The next icon"
            />
          </Col>
          <Col className="text-center" sm={5} xs={5}>
            <Form.Control ref={endDate} value={listdata.end_date} onChange={handleEndDateChange} type="date" onBlur={handleUpdateListClick} />
          </Col>
          {/* <Col className="text-center d-none d-sm-block" sm={2}>
            <NavLink to="/prelist">
              <a id="prelist">
                <img
                  src="/UserListSource/bag.png"
                  style={{ width: "20px", height: "20px", paddingBottom: "0" }}
                  className="m-2"
                />
                行前清單
              </a>
            </NavLink>
          </Col> */}
          <Col sm={1}></Col>
        </Row>
      </Row>
      <JourneyList
        onFocusJourneyProject={onFocusJourneyProject}
        setOutOfTheJourney={setOutOfTheJourney}
        journeys={listdata.journeys}
        listdata={listdata}
        update_info={update_info} onFocusJourney={onFocusJourney} setShowJourney={setShowJourney}
        onRemoveJourney={onRemoveJourney}
        setSelectedJourneyData={setSelectedJourneyData}
        setIsSearchAttractionProjectsDataChosen={setIsSearchAttractionProjectsDataChosen}
      />
      {/* <Day></Day> */}

      <Row className="m-4">
        <Col sm={1}></Col>
        <Col sm={10} style={{ minHeight: "100vh", position: "relative" }}>
          <Form
            className="d-flex flex-column justify-content-end"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <Row>
              {outOfTheJourney ?
                <div>
                  <Row className="align-items-center justify-content-center p-3" style={{ position: 'fixed', bottom: 68, left: '25.8%', width: '53%', padding: '10px' }}>
                    {searchAttractionsData.length > 0 && isSearchAttractionsDataChosen === false ? (
                      searchAttractionsData.map((item, index) => {
                        return <Attraction
                          key={index}
                          attractionData={item}
                          setSearchAttractionsDataValue={setSearchAttractionsDataValue}
                        />;
                      })
                    ) : (
                      <div></div>
                    )}

                  </Row>
                  <Row className="align-items-center justify-content-center p-3" style={{ position: 'fixed', bottom: 10, left: '25%', width: '55%', padding: '10px' }}>
                    <Col sm={10}>
                      {/* rounded */}
                      <Form.Control

                        value={searchJourneyValue}
                        onChange={(event) => handleSearchAttraction(event)}
                        className="p-3 text-center"
                        type="text"
                        placeholder="輸入景點"
                      />
                    </Col>
                    <Col sm={2}>
                      <button
                        type="button"
                        onClick={handleSearchJourneyClick}
                        style={{ border: "none", backgroundColor: "transparent" }}
                      >
                        <img
                          src="/UserListSource/send.png"
                          style={{
                            width: "48px",
                            height: "48px",
                            paddingBottom: "0",
                          }}
                        />
                      </button>
                    </Col>
                  </Row>
                </div>
                :
                <div className="isjourney">
                  <Row className="align-items-center justify-content-center p-3 isjourney" style={{ position: 'fixed', bottom: 68, left: '25.8%', width: '53%', padding: '10px' }}>
                    {searchAttractionProjectsData.length > 0 && isSearchAttractionProjectsDataChosen === false ? (
                      searchAttractionProjectsData.map((item, index) => {
                        return <Project
                          key={index}
                          projectData={item}
                          setSearchAttractionProjectDataValue={setSearchAttractionProjectDataValue}
                        />;
                      })
                    ) : (
                      <div></div>
                    )}

                  </Row>
                  <Row className="align-items-center justify-content-center p-3" style={{ position: 'fixed', bottom: 10, left: '25%', width: '55%', padding: '10px' }}>
                    <Col sm={10}>
                      {/* rounded */}
                      <Form.Control

                        value={searchJourneyProjectValue}
                        onChange={(event) => setSearchJourneyProjectValue(event.target.value)}
                        onFocus={(event) => handleSearchAttractionProject(event)}
                        className="p-3 text-center"
                        type="text"
                        placeholder="輸入活動項目"
                      />
                    </Col>
                    <Col sm={2}>
                      <button
                        type="button"
                        onClick={handleSearchJourneyProjectClick}
                        style={{ border: "none", backgroundColor: "transparent" }}
                      >
                        <img
                          src="/UserListSource/send.png"
                          style={{
                            width: "48px",
                            height: "48px",
                            paddingBottom: "0",
                          }}
                        />
                      </button>
                    </Col>
                  </Row>
                </div>
              }

            </Row>
          </Form>
        </Col>
        <Col sm={1}></Col>
      </Row >
    </>
  );
}

export default TwoAreaMiddle;