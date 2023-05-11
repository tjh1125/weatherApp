import React from "react";

export default function history({historyData, onClickSearch, onClickRemove}) {

    return(
        <>
            {historyData.map((history, index) => {
                let searchingDateTimeArray = history.searchingDateTime.split(' ');
                let searchingTime = searchingDateTimeArray[1] + ' ' + searchingDateTimeArray[2];

                return (
                    <div className="history_row" key={index}>
                        <div className="history_content_lf">{index + 1}. {history.cityName}, {history.countryCode}</div>
                        <div className="history_content_rgt">{searchingTime}</div>
                        <div className="icon">
                            <div className="icon_search" onClick={() => onClickSearch(history)}></div>
                        </div>
                        <div className="icon">
                            <div className="icon_del" onClick={() => onClickRemove(history)}></div>
                        </div>
                    </div>
                )
            })}
        </>
    );
}