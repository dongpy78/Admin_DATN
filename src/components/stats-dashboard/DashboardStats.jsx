import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import { PieChart } from "react-minimal-pie-chart";

import WrapperStatsContainer from "../../assets/wrappers/StatsContainer";
import WrapperChartsContainer from "../../assets/wrappers/ChartsContainer";
import HistoryTradePostWrapper from "../../assets/wrappers/HistoryTradePostWrapper";

import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";
import {
  getStatisticalTypePost,
  getStatisticalPackagePost,
} from "../../services/userService";
import { PAGINATION } from "../../constants/paginationConstant";
import CommonUtils from "../../utils/CommonUtils";

const DashboardStats = () => {
  const { RangePicker } = DatePicker;
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  const formattedToday = yyyy + "-" + mm + "-" + dd;

  const [user, setUser] = useState({});
  const [dataSum, setDataSum] = useState(0);

  const [dataStatisticalTypePost, setDataStatisticalTypePost] = useState([]);
  const [dataStatisticalPackagePost, setDataStatisticalPackagePost] = useState(
    []
  );
  const [count, setCount] = useState("");
  const [formDatePost, setFormDatePost] = useState(formattedToday);
  const [toDatePost, setToDatePost] = useState(formattedToday);

  const [loading, setLoading] = useState(true);

  let sendParams = {
    limit: PAGINATION.pagerow,
    offset: 0,
    fromDate: formattedToday,
    toDate: formattedToday,
    companyId: user.companyId,
  };

  let handleOnClickExport = async (type) => {
    let res = [];
    if (type === "packagePost") {
      res = await getStatisticalPackagePost({
        fromDate: formDatePost,
        toDate: toDatePost,
        limit: "",
        offset: "",
      });
    }
    if (res) {
      console.log("export", res);
      let formatData = res.data.data.map((item) => {
        let obj = {
          "Mã gói": item.id,
          "Tên gói": item.name,
          "Loại gói": item.isHot === 1 ? "Loại nổi bật" : "Loại bình thường",
          "Số lượng": +item.count,
          Tổng: +item.total + "USD",
        };
        if (type !== "packagePost") delete obj["Loại gói"];
        return obj;
      });
      if (type === "packagePost") {
        await CommonUtils.exportExcel(
          formatData,
          "Statistical Package Post",
          "Statistical Package Post"
        );
      }
    }
  };

  let onDatePicker = async (values, type = "packagePost") => {
    let fromDate = formattedToday;
    let toDate = formattedToday;
    if (values) {
      fromDate = values[0].format("YYYY-MM-DD");
      toDate = values[1].format("YYYY-MM-DD");
    }

    getStatistical(fromDate, toDate, type);
  };

  let getStatistical = async (fromDate, toDate, type = "packagePost") => {
    let arrData = [];
    if (type === "packagePost") {
      setFormDatePost(fromDate);
      arrData = await getStatisticalPackagePost({
        fromDate,
        toDate,
        limit: PAGINATION.pagerow,
        offset: 0,
      });
      if (arrData) {
        console.log("arrData", arrData);
        setDataStatisticalPackagePost(arrData.data.data);
        setDataSum(arrData.data.sum);
        setCount(Math.ceil(arrData.count / PAGINATION.pagerow));
      }
    }
  };

  const getData = async (limit) => {
    let res = await getStatisticalTypePost(limit);
    let other = res.data.totalPost;
    let otherPercent = 100;
    let color = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
    if (res) {
      let newdata = res.data.data.map((item, index) => {
        other -= item.amount;
        otherPercent -=
          Math.round((item.amount / res.totalPost) * 100 * 100) / 100;
        return {
          title: item.postDetailData.jobTypePostData.value,
          value:
            Math.round((item.amount / res.data.totalPost) * 100 * 100) / 100,
          color: color[index],
          amount: item.amount,
        };
      });
      if (other > 0) {
        newdata.push({
          title: "Lĩnh vực khác",
          value: Math.round(otherPercent * 100) / 100,
          color: color[4],
          amount: other,
        });
      }
      setDataStatisticalTypePost(newdata);
    } else showErrorToast(res.message);
  };

  useEffect(() => {
    const fetchData = async () => {
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      setUser(userData);
      await getData(4);
    };
    fetchData();
  }, []);

  useEffect(() => {
    try {
      let fetchData = async () => {
        // const userData = JSON.parse(localStorage.getItem("userData"));
        getStatistical(formattedToday, formattedToday, "packagePost");
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <WrapperChartsContainer>
      <h5>Xin chào {user.name || "Người dùng"}</h5>
      <h5>Biểu đồ thống kê top lĩnh vực</h5>
      {dataStatisticalTypePost.length > 0 ? (
        <WrapperStatsContainer>
          <div>
            {dataStatisticalTypePost.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                style={{ marginBottom: "10px", marginTop: "1rem" }}
              >
                <div
                  style={{
                    width: "50px",
                    backgroundColor: item.color,
                    height: "20px",
                  }}
                ></div>
                <span style={{ marginTop: "0.5rem", display: "block" }}>
                  {item.title}: {item.amount} bài
                </span>
              </div>
            ))}
          </div>
          <div style={{ width: "300px", height: "300px" }}>
            <PieChart
              data={dataStatisticalTypePost}
              label={({ dataEntry }) => `${dataEntry.value.toFixed(2)}%`}
              labelStyle={{
                fontSize: "5px",
                fill: "#000",
                fontWeight: "bold",
              }}
              labelPosition={60}
              animate
            />
          </div>
        </WrapperStatsContainer>
      ) : (
        <p>No data available to display the chart.</p>
      )}

      <HistoryTradePostWrapper>
        <h5 className="title-list-job">
          Bảng thống kê doanh thu các gói bài đăng
        </h5>
        <div style={{ marginBottom: "20px" }}>
          <RangePicker
            onChange={(values) => onDatePicker(values, "packagePost")}
            format={"DD/MM/YYYY"}
          ></RangePicker>
          <button
            onClick={() => handleOnClickExport("packagePost")}
            style={{
              marginLeft: "10px",
              padding: "5px 15px",
              backgroundColor: "#4B49AC",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Export Excel
          </button>
        </div>

        <div className="jobtype-container">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên gói</th>
                <th>Mã gói</th>
                <th>Loại gói</th>
                <th>Số lượng đã bán</th>
                <th>Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {dataStatisticalPackagePost.length > 0 ? (
                dataStatisticalPackagePost.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      {/* {index + 1 + (currentPage - 1) * PAGINATION.pagerow} */}
                      {index + 1}
                    </td>
                    <td>{item.name}</td>
                    <td>{item.id}</td>
                    <td>
                      {item.isHot === 0 ? "Loại bình thường" : "Loại nổi bật"}
                    </td>
                    <td>{item.count}</td>
                    <td>{item.total} USD</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
            {dataStatisticalPackagePost.length > 0 && (
              <tfoot>
                <tr style={{ fontWeight: "500", backgroundColor: "#f0f0f0" }}>
                  <td colSpan="6" style={{ textAlign: "right" }}>
                    Tổng doanh thu: {dataSum} USD
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </HistoryTradePostWrapper>
    </WrapperChartsContainer>
  );
};

export default DashboardStats;
