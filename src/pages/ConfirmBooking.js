import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ConfirmPage() {
    const { key } = useParams(); // URL 파라미터로부터 key 받기
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8787/reservation/confirm?key=${key}`);
                setData(response.data);
            } catch (error) {
                console.error("❌ 예매 확인 중 오류:", error);
            }
        };

        if (key) fetchData();
    }, [key]);

    if (!key) return <p>잘못된 접근입니다. key가 없습니다.</p>;
    if (!data) return <p>데이터를 불러오는 중...</p>;

    const { reservationDTO, rSpots } = data;

    return (
        <div>
            <h2>예매 확인</h2>
            <ul>
                <li><strong>공연 제목:</strong> {reservationDTO.pTitle}</li>
                <li><strong>장소:</strong> {reservationDTO.pPlace}</li>
                <li><strong>날짜:</strong> {reservationDTO.pDate}</li>
                <li><strong>가격:</strong> {reservationDTO.pPrice}</li>
                <li><strong>선택한 좌석:</strong> {rSpots.join(", ")}</li>
                <li><strong>예약자 이메일:</strong> {reservationDTO.rEmail}</li>
            </ul>
        </div>
    );
}

export default ConfirmPage;
