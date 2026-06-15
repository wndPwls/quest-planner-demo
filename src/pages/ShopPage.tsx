import { useNavigate } from 'react-router-dom';
import './ShopPage.css';

export default function ShopPage() {
  const navigate = useNavigate();

  return (
    <div className="page shop-page">
      <div className="shop-construction">
        <div className="shop-icon">🏪</div>
        <div className="shop-title">상점 공사 중</div>
        <div className="shop-desc">
          더 멋진 아이템과 캐릭터 꾸미기 기능을<br />
          준비하고 있어요. 조금만 기다려주세요!
        </div>
        <button className="btn-ghost" onClick={() => navigate(-1)}>
          돌아가기
        </button>
      </div>
    </div>
  );
}
