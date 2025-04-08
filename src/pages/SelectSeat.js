import { useEffect, useState } from "react";
import { useNavigate, useParams  } from "react-router-dom";
import axios from "axios";

function SelectSeat() {
    const { key } = useParams();
    const navigate = useNavigate();

    const [reservationRequest, setReservationRequest] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    if (!key) {
       console.error("❌ 키가 없습니다.");
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8787/reservation/select?key=${key}`);
                setReservationRequest(response.data);

                const total = response.data.reservationDTO.pAllSpot || 20;
                const rows = ["A", "B", "C", "D", "E"];
                const generated = [];

                for (let i = 0; i < total; i++) {
                    const row = rows[Math.floor(i / 10)];
                    const num = (i % 10) + 1;
                    generated.push({ id: `${row}${num}`, status: "available" });
                }

                setSeats(generated);
            } catch (e) {
                console.error("데이터 불러오기 실패:", e);
            }
        };

        if (key) fetchData();
    }, [key]);

    const toggleSeat = (id) => {
        setSelectedSeats((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const goToConfirmPage = async () => {
        if (selectedSeats.length === 0) {
            alert("최소 1개 이상의 좌석을 선택해주세요.");
            return;
        }
    
        try {
            const params = new URLSearchParams();
            params.append("key", key);
            selectedSeats.forEach((seat) => params.append("rSpots", seat));
    
            // 백엔드에 선택한 좌석 전송
            await axios.post("http://localhost:8787/reservation/confirm", params);
    
            // 성공하면 다음 페이지 이동 (key만 넘겨도 됨)
            navigate(`/confirm/${key}`);
        } catch (error) {
            console.error("❌ 예매 확정 중 오류:", error);
            alert("예매 확정 중 오류가 발생했습니다.");
        }
    };
    
    
    return (
        <div className="seat-selection-container">
            <h2>좌석 선택</h2>
            
            {reservationRequest ? (
                <>
                    <ul>
                        <li><strong>공연 제목:</strong> {reservationRequest.reservationDTO.pTitle}</li>
                        <li><strong>장소:</strong> {reservationRequest.reservationDTO.pPlace}</li>
                        <li><strong>날짜:</strong> {reservationRequest.reservationDTO.pDate}</li>
                        <li><strong>가격:</strong> {reservationRequest.reservationDTO.pPrice}</li>
                    </ul>

                    <div className="seat-grid">
                        {seats.map((seat) => (
                            <button
                                key={seat.id}
                                className={`seat-button ${selectedSeats.includes(seat.id) ? "selected" : ""}`}
                                onClick={() => toggleSeat(seat.id)}
                            >
                                {seat.id}
                            </button>
                        ))}
                    </div>

                    <div className="selected-info">
                        <h3>선택한 좌석:</h3>
                        <p>{selectedSeats.join(", ") || "없음"}</p>
                    </div>

                    <button className="confirm-btn" onClick={goToConfirmPage}>예매하기</button>
                </>
            ) : (
                <p>좌석 정보를 불러오는 중...</p>
            )}
        </div>
    );
}

export default SelectSeat;
