import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ConfirmPage() {
    const { key } = useParams(); // URL 파라미터로부터 key 받기
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [rPhone, setRPhone] = useState("");
    const [rEmail, setREmail] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8787/reservation/confirm?key=${key}`);
                setData(response);
                setRPhone(response.data.reservationDTO.rPhone);
                setREmail(response.data.reservationDTO.rEmail);
            } catch (error) {
                console.error("❌ 예매 확인 중 오류:", error);
            }
        };

        if (key) fetchData();
    }, [key]);

    const handleComplete = async () => {
        if (!rPhone || !rEmail) {
            alert("전화번호와 이메일을 모두 입력해주세요.");
            return;
        }
    
        try {
            const params = new URLSearchParams();
            console.log("rEmail", rEmail);
            params.append("key", key);
            params.append("rPhone", rPhone);
            params.append("rEmail", rEmail);
            console.log("rEmail", params.rEmail);
        
            // 백엔드로 예약 완료 요청
            await axios.post("http://localhost:8787/reservation/complete", params);
            
            alert("예매가 완료되었습니다.");
            navigate(`/complete/${key}`);
        } catch (error) {
            console.error("❌ 예매 완료 중 오류:", error);
            alert("예매 완료 중 오류가 발생했습니다.");
        }
    };
    

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
                <li><strong>예매자:</strong> {reservationDTO.uName}</li>
                <li><strong>전화번호:</strong> <input type="text" value={reservationDTO.rPhone} onChange={(e) => setRPhone(e.target.value)} /></li>
                <li><strong>이메일:</strong> <input type="text" value={reservationDTO.rEmail} onChange={(e) => setREmail(e.target.value)} /></li>
            </ul>
            <button className="complete-btn" onClick={handleComplete}>예매 완료</button>
        </div>
    );
}

export default ConfirmPage;