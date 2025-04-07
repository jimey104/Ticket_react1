import { useParams } from "react-router-dom";
import "../styles/complete.css";

function CompleteBooking() {
    const { pId } = useParams(); // URL에서 pId 가져오기

    return (
        <div className="complete-container">
            <h2>예매 완료 🎉</h2>
            <p>예매가 성공적으로 완료되었습니다!</p>
            <p><strong>공연 ID:</strong> {pId}</p>
            <p>이용해 주셔서 감사합니다.</p>
            <a href="/" className="home-link">홈으로 돌아가기</a>
        </div>
    );
}

export default CompleteBooking;
