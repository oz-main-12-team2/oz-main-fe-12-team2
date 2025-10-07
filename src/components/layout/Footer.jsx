import "../../styles/footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* 왼쪽 영역 */}
        <div className="footer-left">
          <div className="footer-company-info">
            <span>러블2㈜ 대표이사 : 러블2</span>
            <span>사업자등록번호 123-45-12345</span>
            <span>통신판매업신고번호 2025-서울강남-1123</span>
            <span>호스팅 서비스사업자: 러블2㈜</span>
            <span>서울 강남구 테헤란로 231 EAST 18층 401호</span>
            <span>이메일 상담 info@lovely.com</span>
            <span>유선 상담 1661-1234</span>
            <span>© lovely Co. Ltd.</span>
          </div>

          <p className="footer-note">
            일부 상품의 경우 러블2는 통신판매중개자이며 통신판매 당사자가
            아닙니다.
            <br />
            해당되는 상품의 경우 상품, 상품정보, 거래에 관한 의무와 책임은
            판매자에게 있으므로, 각 상품 페이지에서 구체적인 내용을 확인하시기
            바랍니다.
          </p>

          <p className="footer-copy">
            러블2 사이트의 리워드 정보, 메이커 정보, 스토리 정보, 콘텐츠, UI
            등에 대한 무단복제, 전송, 배포, 크롤링, 스크래핑 등의 행위는
            저작권법, 콘텐츠산업 진흥법 등 관련 법령에 의하여 엄격히 금지됩니다.
          </p>
        </div>

        {/* 오른쪽 영역 */}
        <div className="footer-right">
          <div className="footer-section">
            <h4>러블2 고객센터</h4>
            <div>1661-1234</div>
          </div>

          <div className="footer-section">
            <h4>상담 가능 시간</h4>
            <div>평일 오전 9시 ~ 오후 6시</div>
            <div>(주말, 공휴일 제외)</div>
          </div>

          <div className="footer-apps">
            <a href="#" className="footer-app-link">
              <svg
                viewBox="0 0 40 40"
                width="20"
                height="20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="footer-app-icon"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5 34.4V5.6a2.5 2.5 0 011.4-2.2L23.1 20 6.4 36.6A2.6 2.6 0 015 34.4zm23.3-9.1L10.2 35.8l14.3-14.4 3.8 3.9zM34 18a2.6 2.6 0 011 2 2.5 2.5 0 01-1 2l-3.9 2.2-4.2-4.2 4.2-4.2L34 18zM10.2 4.2l18.1 10.5-3.8 3.8L10.2 4.2z"
                  fill="currentColor"
                />
              </svg>
              Android 앱
            </a>

            <span className="footer-divider">|</span>

            <a href="#" className="footer-app-link">
              <svg
                viewBox="0 0 40 40"
                width="20"
                height="20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="footer-app-icon"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M33.631 34.967c-1.673 2.514-3.466 4.91-6.096 4.91s-3.466-1.557-6.574-1.557c-3.108 0-3.945 1.556-6.575 1.676-2.63.12-4.542-2.634-6.215-5.03-3.467-4.91-5.977-14.01-2.51-20.117a9.68 9.68 0 018.247-5.03c2.51 0 5.02 1.677 6.575 1.677 1.553 0 4.542-2.156 7.65-1.796a9.2 9.2 0 017.291 3.951 9.104 9.104 0 00-4.303 7.544A8.862 8.862 0 0036.5 29.22a22.05 22.05 0 01-2.869 5.748zM22.276 2.994A9.08 9.08 0 0128.133 0 8.753 8.753 0 0126.1 6.347a7.287 7.287 0 01-5.857 2.874 8.512 8.512 0 012.032-6.227z"
                  fill="currentColor"
                />
              </svg>
              iOS 앱
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
