import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/selectseat.css";

function SelectSeat() {
    const pId = 100;
    const uId = 1;
    // const { pId, uId } = useParams();
    const navigate = useNavigate();
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    
    useEffect(() => {
        const fetchSeats = async () => {
            try {
                console.log(`🎯 요청 URL: http://localhost:8787/reservation/seats/${pId}/${uId}`);   //${rId}
                const response = await axios.get(`http://localhost:8787/reservation/seats/${pId}/${uId}`);
                console.log("📌 백엔드 응답 데이터:", response.data);

                if (!response.data || response.data.length === 0) {
                    console.log("📌 백엔드 응답 데이터:", response.data);
                    console.error("⚠️ 좌석 데이터가 없습니다.");
                    return;
                }

                const totalSeats = response.data[0]?.pAllSpot || 20;
                console.log(`🎫 총 좌석 개수: ${totalSeats}`);

                const rows = ["A", "B", "C", "D", "E"];
                const generatedSeats = [];

                for (let i = 0; i < totalSeats; i++) {
                    const row = rows[Math.floor(i / 10)];
                    const seatNumber = (i % 10) + 1;
                    const seatId = `${row}${seatNumber}`;

                    generatedSeats.push({
                        id: seatId, // ✅ 좌석 번호를 ID로 사용
                        status: "available",
                    });
                }

                console.log("✅ 생성된 좌석 데이터:", generatedSeats);
                setSeats(generatedSeats);
            } catch (error) {
                console.error("🚨 좌석 정보를 불러오는 데 실패:", error);
            }
        };

        fetchSeats();
    }, [pId, uId]); // ✅ pId가 바뀔 때마다 실행

    const toggleSeatSelection = (seatId) => {
        setSelectedSeats((prev) =>
            prev.includes(seatId) ? prev.filter((seat) => seat !== seatId) : [...prev, seatId]
        );
    };

    const goToConfirmPage = () => {
        if (selectedSeats.length === 0) {
            alert("최소 1개 이상의 좌석을 선택해주세요.");
            return;
        }
        console.log("✅ 선택된 좌석:", selectedSeats);
        navigate(`/confirm/${pId}`, { state: { selectedSeats } });
    };

    return (
        <div className="seat-selection-container">
            <h2>좌석 선택</h2>
            <div className="seat-grid">
                {seats.length === 0 ? (
                    <p>좌석 정보를 불러오는 중...</p>
                ) : (
                    seats.map((seat) => (
                        <button
                            key={seat.id}
                            className={`seat-button ${selectedSeats.includes(seat.id) ? "selected" : ""}`}
                            onClick={() => toggleSeatSelection(seat.id)}
                        >
                            {seat.id}
                        </button>
                    ))
                )}
            </div>
            <div className="selected-info">
                <h3>선택한 좌석:</h3>
                <p>{selectedSeats.length > 0 ? selectedSeats.join(", ") : "없음"}</p>
            </div>
            <button className="confirm-btn" onClick={goToConfirmPage}>
                예매하기
            </button>
        </div>
    );
}

export default SelectSeat;
