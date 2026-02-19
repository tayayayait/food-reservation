# 식당 미리주문/픽업 플랫폼 — UI/UX 상세 명세서 (XML 형식)

> 본 문서는 `상세서.md`의 동일한 내용을 AI가 구조적으로 파싱할 수 있는 XML 형식으로 변환한 것입니다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<design-system version="1.0" date="2026-02-19">

  <meta>
    <project>식당 미리주문/픽업 플랫폼 MVP</project>
    <targets>
      <target type="mobile-app" name="고객용 앱" />
      <target type="mobile-app" name="사장님 앱" />
      <target type="web" name="관리자 웹" />
    </targets>
    <benchmarks>
      <benchmark>배달의민족</benchmark>
      <benchmark>네이버 예약</benchmark>
      <benchmark>테이블링</benchmark>
      <benchmark>패스오더</benchmark>
    </benchmarks>
  </meta>

  <!-- ============================================================ -->
  <!-- 1. 디자인 토큰 (Design Tokens)                                -->
  <!-- ============================================================ -->
  <design-tokens>

    <!-- 1.1 색상 팔레트 -->
    <colors>

      <color-group name="primary" label="브랜드">
        <color token="primary-50"  hex="#FFF3E0" usage="배경 틴트, 태그 배경"       rule="강조 영역의 연한 배경" />
        <color token="primary-100" hex="#FFE0B2" usage="호버 배경, 선택 상태 배경"  rule="" />
        <color token="primary-200" hex="#FFCC80" usage="보조 아이콘"                rule="" />
        <color token="primary-300" hex="#FFB74D" usage="프로그레스 바"              rule="" />
        <color token="primary-400" hex="#FFA726" usage="호버 상태 버튼"             rule="" />
        <color token="primary-500" hex="#FF6F00" usage="CTA 버튼, 로고, 핵심 액센트" rule="배달의민족 스타일 오렌지" />
        <color token="primary-600" hex="#FB8C00" usage="활성 탭, 링크 텍스트"       rule="" />
        <color token="primary-700" hex="#F57C00" usage="Active/Pressed 버튼"        rule="" />
        <color token="primary-800" hex="#EF6C00" usage="다크모드 CTA"               rule="" />
        <color token="primary-900" hex="#E65100" usage="경고 강조"                  rule="" />
      </color-group>

      <color-group name="neutral" label="그레이스케일">
        <color token="neutral-0"   hex="#FFFFFF" usage="카드 배경, 모달 배경"     rule="" />
        <color token="neutral-50"  hex="#FAFAFA" usage="페이지 배경"              rule="" />
        <color token="neutral-100" hex="#F5F5F5" usage="입력창 배경(비활성)"      rule="" />
        <color token="neutral-200" hex="#EEEEEE" usage="디바이더, 테이블 줄 구분" rule="" />
        <color token="neutral-300" hex="#E0E0E0" usage="보더(기본)"               rule="" />
        <color token="neutral-400" hex="#BDBDBD" usage="플레이스홀더 텍스트"      rule="" />
        <color token="neutral-500" hex="#9E9E9E" usage="비활성 아이콘"            rule="" />
        <color token="neutral-600" hex="#757575" usage="보조 텍스트, 캡션"        rule="최소 대비비 4.5:1" />
        <color token="neutral-700" hex="#616161" usage="부제목"                   rule="" />
        <color token="neutral-800" hex="#424242" usage="본문 텍스트"              rule="" />
        <color token="neutral-900" hex="#212121" usage="제목, 헤딩"               rule="기본 텍스트 컬러" />
      </color-group>

      <color-group name="semantic" label="상태 컬러">
        <color token="success-light" hex="#E8F5E9" usage="성공 배경"              rule="" />
        <color token="success"       hex="#4CAF50" usage="완료 배지, 성공 토스트" rule="" />
        <color token="success-dark"  hex="#2E7D32" usage="성공 텍스트"            rule="" />
        <color token="warning-light" hex="#FFF8E1" usage="경고 배경"              rule="" />
        <color token="warning"       hex="#FFC107" usage="지연 상태, 경고 아이콘" rule="" />
        <color token="warning-dark"  hex="#F9A825" usage="경고 텍스트"            rule="" />
        <color token="error-light"   hex="#FFEBEE" usage="에러 배경"              rule="" />
        <color token="error"         hex="#F44336" usage="에러 보더, 거절 배지"   rule="" />
        <color token="error-dark"    hex="#C62828" usage="에러 텍스트"            rule="" />
        <color token="info-light"    hex="#E3F2FD" usage="정보 배경"              rule="" />
        <color token="info"          hex="#2196F3" usage="링크, 정보 아이콘"      rule="" />
        <color token="info-dark"     hex="#1565C0" usage="정보 텍스트"            rule="" />
      </color-group>

      <color-group name="order-status" label="주문 상태 전용">
        <color token="status-pending"  hex="#FF9800" usage="접수 대기"             rule="아이콘+텍스트 동일" />
        <color token="status-accepted" hex="#2196F3" usage="주문 수락"             rule="" />
        <color token="status-cooking"  hex="#FF6F00" usage="조리중"                rule="primary-500과 동일" />
        <color token="status-ready"    hex="#4CAF50" usage="조리 완료 / 픽업 가능" rule="" />
        <color token="status-rejected" hex="#F44336" usage="주문 거절"             rule="" />
        <color token="status-delayed"  hex="#FFC107" usage="지연 처리"             rule="" />
      </color-group>

    </colors>

    <!-- 1.2 타이포그래피 -->
    <typography>

      <font-families>
        <font usage="한글 본문/제목" family="Pretendard"     fallback="'Apple SD Gothic Neo','Malgun Gothic',sans-serif" note="Google Fonts" />
        <font usage="영문/숫자 강조" family="Inter"          fallback="'Helvetica Neue',Arial,sans-serif"                note="가격, 시간" />
        <font usage="모노스페이스"   family="JetBrains Mono" fallback="'Courier New',monospace"                          note="정산 코드, 주문번호" />
      </font-families>

      <type-scale platform="mobile">
        <type token="heading-xl" size="28" weight="700" line-height="1.3" letter-spacing="-0.02em" usage="페이지 타이틀" />
        <type token="heading-lg" size="24" weight="700" line-height="1.3" letter-spacing="-0.01em" usage="섹션 타이틀" />
        <type token="heading-md" size="20" weight="600" line-height="1.4" letter-spacing="-0.01em" usage="카드 타이틀, 매장명" />
        <type token="heading-sm" size="18" weight="600" line-height="1.4" letter-spacing="0"       usage="서브 헤딩" />
        <type token="body-lg"    size="16" weight="400" line-height="1.6" letter-spacing="0"       usage="본문(기본)" />
        <type token="body-md"    size="14" weight="400" line-height="1.5" letter-spacing="0"       usage="보조 설명, 리스트" />
        <type token="body-sm"    size="12" weight="400" line-height="1.5" letter-spacing="0.01em"  usage="캡션, 타임스탬프" />
        <type token="body-xs"    size="10" weight="500" line-height="1.4" letter-spacing="0.02em"  usage="배지, 라벨" />
        <type token="button-lg"  size="16" weight="600" line-height="1.0" letter-spacing="0.02em"  usage="대형 CTA 버튼" />
        <type token="button-md"  size="14" weight="600" line-height="1.0" letter-spacing="0.02em"  usage="일반 버튼" />
        <type token="button-sm"  size="12" weight="600" line-height="1.0" letter-spacing="0.02em"  usage="소형 버튼, 칩" />
        <type token="price"      size="20" weight="700" line-height="1.2" letter-spacing="-0.01em" usage="가격 표시 (Inter)" />
      </type-scale>

      <type-scale platform="desktop">
        <type token="web-heading-xl" size="32" weight="700" line-height="1.3" usage="대시보드 타이틀" />
        <type token="web-heading-lg" size="24" weight="700" line-height="1.3" usage="섹션 타이틀" />
        <type token="web-heading-md" size="20" weight="600" line-height="1.4" usage="카드 헤딩" />
        <type token="web-body-lg"    size="16" weight="400" line-height="1.6" usage="본문(기본)" />
        <type token="web-body-md"    size="14" weight="400" line-height="1.5" usage="테이블 셀, 보조" />
        <type token="web-body-sm"    size="12" weight="400" line-height="1.5" usage="캡션, 풋터" />
      </type-scale>

    </typography>

    <!-- 1.3 간격 시스템 -->
    <spacing unit="px" base="4">
      <space token="space-0"  value="0"  usage="" />
      <space token="space-1"  value="4"  usage="인라인 아이콘–텍스트 간격" />
      <space token="space-2"  value="8"  usage="아이콘 패딩, 칩 내부 패딩" />
      <space token="space-3"  value="12" usage="입력창 내부 상하 패딩" />
      <space token="space-4"  value="16" usage="카드 내부 패딩, 리스트 아이템 간격" />
      <space token="space-5"  value="20" usage="섹션 내 그룹 간격" />
      <space token="space-6"  value="24" usage="섹션 간 기본 간격" />
      <space token="space-8"  value="32" usage="페이지 좌우 패딩(모바일)" />
      <space token="space-10" value="40" usage="섹션 간 대형 간격" />
      <space token="space-12" value="48" usage="CTA 영역 상하 패딩" />
      <space token="space-16" value="64" usage="페이지 상단 여백" />
      <space token="space-20" value="80" usage="페이지 하단 여백(바텀 네비 고려)" />
    </spacing>

    <!-- 1.4 테두리 반경 -->
    <border-radius unit="px">
      <radius token="radius-none" value="0"    usage="테이블 셀"           rule="" />
      <radius token="radius-xs"   value="4"    usage="배지, 칩, 작은 태그" rule="" />
      <radius token="radius-sm"   value="8"    usage="입력창, 드롭다운"    rule="" />
      <radius token="radius-md"   value="12"   usage="카드, 토스트"        rule="기본 카드 반경" />
      <radius token="radius-lg"   value="16"   usage="모달, 바텀시트"      rule="" />
      <radius token="radius-xl"   value="20"   usage="CTA 버튼, 슬롯 카드" rule="둥근 느낌 강조" />
      <radius token="radius-2xl"  value="24"   usage="플로팅 버튼"         rule="" />
      <radius token="radius-full" value="9999" usage="아바타, 원형 버튼"   rule="" />
    </border-radius>

    <!-- 1.5 그림자 -->
    <shadows>
      <shadow token="shadow-xs"    value="0 1px 2px rgba(0,0,0,0.05)"       usage="입력창 기본"          rule="" />
      <shadow token="shadow-sm"    value="0 2px 4px rgba(0,0,0,0.08)"       usage="카드(기본 상태)"      rule="" />
      <shadow token="shadow-md"    value="0 4px 12px rgba(0,0,0,0.10)"      usage="카드(호버), 드롭다운" rule="" />
      <shadow token="shadow-lg"    value="0 8px 24px rgba(0,0,0,0.12)"      usage="모달, 바텀시트"       rule="" />
      <shadow token="shadow-xl"    value="0 16px 48px rgba(0,0,0,0.16)"     usage="오버레이"             rule="" />
      <shadow token="shadow-top"   value="0 -2px 8px rgba(0,0,0,0.06)"      usage="바텀 네비게이션"      rule="상단 그림자" />
      <shadow token="shadow-inner" value="inset 0 2px 4px rgba(0,0,0,0.04)" usage="활성 입력창"          rule="" />
    </shadows>

    <!-- 1.6 모션 -->
    <motion note="prefers-reduced-motion: reduce 감지 시 모든 Duration→0ms, Transform→none">
      <transition token="motion-instant" duration="0"   easing=""                               usage="즉각 반응 (탭 색상)"          rule="" />
      <transition token="motion-fast"    duration="100" easing="ease-out"                       usage="버튼 active 상태"             rule="" />
      <transition token="motion-normal"  duration="200" easing="ease-in-out"                    usage="호버 효과, 토글, 탭 전환"     rule="기본값" />
      <transition token="motion-slow"    duration="300" easing="ease-in-out"                    usage="모달 열기/닫기, 드로어"       rule="" />
      <transition token="motion-gentle"  duration="400" easing="cubic-bezier(0.25,0.1,0.25,1)"  usage="바텀시트 슬라이드, 페이지 전환" rule="" />
      <transition token="motion-spring"  duration="500" easing="cubic-bezier(0.34,1.56,0.64,1)" usage="토스트 팝인, 성공 애니메이션" rule="바운스 효과" />
    </motion>

    <!-- 1.7 Z-Index -->
    <z-index>
      <layer token="z-base"     value="0"  usage="일반 콘텐츠"       rule="" />
      <layer token="z-dropdown" value="10" usage="드롭다운 메뉴"     rule="" />
      <layer token="z-sticky"   value="20" usage="고정 헤더, 고정 탭" rule="" />
      <layer token="z-overlay"  value="30" usage="딤(오버레이 배경)"  rule="" />
      <layer token="z-modal"    value="40" usage="모달, 바텀시트"     rule="" />
      <layer token="z-toast"    value="50" usage="토스트 알림"        rule="최상위" />
      <layer token="z-tooltip"  value="60" usage="툴팁"              rule="" />
    </z-index>

  </design-tokens>

  <!-- ============================================================ -->
  <!-- 2. 레이아웃 시스템 (Layout)                                    -->
  <!-- ============================================================ -->
  <layout>

    <breakpoints>
      <breakpoint token="mobile-sm"  value="320"  target="소형 폰 (SE)"  note="최소 지원 너비" />
      <breakpoint token="mobile"     value="375"  target="표준 폰"       note="기본 설계 기준" />
      <breakpoint token="mobile-lg"  value="428"  target="대형 폰"       note="" />
      <breakpoint token="tablet"     value="768"  target="태블릿"        note="사장님 앱 가로" />
      <breakpoint token="desktop"    value="1024" target="소형 데스크톱" note="관리자 웹 최소" />
      <breakpoint token="desktop-lg" value="1280" target="표준 데스크톱" note="관리자 웹 기준" />
      <breakpoint token="desktop-xl" value="1440" target="대형 데스크톱" note="컨테이너 max-width" />
    </breakpoints>

    <grid platform="mobile">
      <columns>4</columns>
      <gutter>16</gutter>
      <margin>16</margin>
      <max-width>428</max-width>
    </grid>

    <grid platform="desktop">
      <columns>12</columns>
      <gutter>24</gutter>
      <margin note="≤1280:32px, >1280:auto">32</margin>
      <max-width>1280</max-width>
      <sidebar expanded="260" collapsed="72" />
    </grid>

    <fixed-elements>
      <element name="모바일 GNB"      position="fixed top"             height="56"           z="20" note="" />
      <element name="바텀 네비"       position="fixed bottom"          height="56+safe-area" z="20" note="shadow-top" />
      <element name="CTA 고정 버튼"   position="fixed bottom(네비 위)" height="64"           z="20" note="" />
      <element name="관리자 헤더"     position="sticky top"            height="64"           z="20" note="" />
      <element name="관리자 사이드바" position="fixed left"            height="100vh"        z="20" note="" />
    </fixed-elements>

    <content-spacing>
      <rule>padding-top = GNB높이 + 16px</rule>
      <rule>padding-bottom = 바텀네비 + CTA + 16px</rule>
      <rule>env(safe-area-inset-bottom) 필수 적용</rule>
    </content-spacing>

  </layout>

  <!-- ============================================================ -->
  <!-- 3. 컴포넌트 규격 (Components)                                  -->
  <!-- ============================================================ -->
  <components>

    <!-- 3.1 Button -->
    <component name="Button">

      <sizes>
        <size name="lg" height="52" padding="16 24" font="16/600" min-width="120" usage="CTA" />
        <size name="md" height="44" padding="12 20" font="14/600" min-width="80"  usage="일반" />
        <size name="sm" height="36" padding="8 16"  font="12/600" min-width="60"  usage="보조" />
        <size name="xs" height="28" padding="4 12"  font="10/500" min-width="40"  usage="태그" />
      </sizes>
      <rule>터치 타겟 최소 44×44px (sm/xs: 히트 영역 확장)</rule>

      <variants>
        <variant name="filled-primary"   bg="primary-500"  text="#FFFFFF"    border="none"                usage="CTA" />
        <variant name="filled-danger"    bg="error"        text="#FFFFFF"    border="none"                usage="거절/삭제" />
        <variant name="outlined"         bg="transparent"  text="primary-500" border="1px primary-500"  usage="보조 CTA" />
        <variant name="outlined-neutral" bg="transparent"  text="neutral-700" border="1px neutral-300"  usage="취소" />
        <variant name="ghost"            bg="transparent"  text="primary-500" border="none"              usage="텍스트 링크" />
        <variant name="ghost-neutral"    bg="transparent"  text="neutral-600" border="none"              usage="보조 텍스트" />
      </variants>

      <states variant="filled-primary">
        <state name="default"  bg="primary-500"            text="#FFF"       border=""                    effect="shadow-xs" />
        <state name="hover"    bg="primary-400"            text="#FFF"       border=""                    effect="shadow-sm, cursor:pointer" />
        <state name="active"   bg="primary-700"            text="#FFF"       border=""                    effect="scale(0.98) 100ms" />
        <state name="focus"    bg="primary-500"            text="#FFF"       border="2px info offset 2px" effect="키보드 전용" />
        <state name="disabled" bg="neutral-200"            text="neutral-400" border=""                   effect="cursor:not-allowed" />
        <state name="loading"  bg="primary-500 opacity:60%" text="hidden"   border=""                    effect="스피너 20px 중앙" />
        <state name="error"    bg="error"                  text="#FFF"       border=""                    effect="" />
      </states>

      <icons>
        <icon position="leading"   size="20" gap="8" />
        <icon position="trailing"  size="20" gap="8" />
        <icon position="icon-only" size="24" gap="0" />
      </icons>

    </component>

    <!-- 3.2 Input -->
    <component name="Input">

      <sizes>
        <size name="lg" height="52" font="16px" usage="검색" />
        <size name="md" height="44" font="16px" usage="일반" />
        <size name="sm" height="36" font="14px" usage="필터" />
      </sizes>
      <rule>모바일 font-size ≥ 16px (iOS 확대 방지)</rule>

      <states>
        <state name="default"  bg="#FFF"       border="1px neutral-300" label-color="neutral-700" note="" />
        <state name="hover"    bg="#FFF"       border="1px neutral-500" label-color=""             note="" />
        <state name="focus"    bg="#FFF"       border="2px primary-500" label-color="primary-500"  note="라벨 상단 이동" />
        <state name="active"   bg="#FFF"       border="2px primary-500" label-color=""             note="입력 중" />
        <state name="disabled" bg="neutral-100" border="1px neutral-200" label-color="neutral-400" note="cursor:not-allowed" />
        <state name="error"    bg="#FFF"       border="2px error"       label-color="error"        note="하단 에러메시지" />
        <state name="loading"  bg="neutral-100" border="1px neutral-300" label-color=""            note="우측 스피너 16px" />
      </states>

      <sub-elements>
        <element name="라벨"          font="body-md"  color="neutral-700" rule="필수 항목은 * 빨간색" />
        <element name="플레이스홀더"   font="body-lg"  color="neutral-400" rule="" />
        <element name="헬퍼 텍스트"    font="body-sm"  color="neutral-600" rule="" />
        <element name="에러 메시지"    font="body-sm"  color="error-dark"  rule="아이콘(⚠) 포함" />
        <element name="접두/접미 아이콘" size="20"     color="neutral-500" rule="클릭 가능 시 primary-500" />
        <element name="문자 카운터"    font="body-xs"  color="neutral-500" rule="우하단 배치" />
      </sub-elements>

    </component>

    <!-- 3.3 Textarea -->
    <component name="Textarea">
      <spec min-height="120" max-height="240" padding="12 16" font="16px" resize="vertical (모바일:none)" />
      <rule>상태는 Input과 동일</rule>
      <rule>문자 카운터: 우하단 body-xs (예: 45/200)</rule>
    </component>

    <!-- 3.4 Card -->
    <component name="Card">

      <sizes>
        <size name="lg" padding="24" radius="16" shadow="shadow-sm" usage="매장상세, 주문요약" />
        <size name="md" padding="16" radius="12" shadow="shadow-sm" usage="메뉴카드, 주문리스트" />
        <size name="sm" padding="12" radius="12" shadow="shadow-xs" usage="슬롯선택, 칩그룹" />
      </sizes>

      <states>
        <state name="default"  bg="#FFF"       border="1px neutral-200"     shadow="shadow-sm" note="" />
        <state name="hover"    bg="#FFF"       border=""                    shadow="shadow-md" note="pointer 200ms" />
        <state name="active"   bg="primary-50" border="2px primary-500"    shadow="shadow-sm" note="" />
        <state name="focus"    bg="#FFF"       border="2px info offset 2px" shadow="shadow-sm" note="키보드" />
        <state name="disabled" bg="neutral-100" border="1px neutral-200"   shadow="none"      note="opacity 0.6" />
        <state name="selected" bg="primary-50" border="2px primary-500"    shadow="shadow-sm" note="✓ 아이콘" />
        <state name="loading"  bg="neutral-100" border=""                  shadow=""          note="스켈레톤" />
        <state name="error"    bg="error-light" border="1px error"         shadow="shadow-xs" note="⚠" />
      </states>

      <preset name="매장카드">
        <element name="썸네일"   spec="120×120px radius-sm" rule="object-fit:cover" />
        <element name="매장명"   font="heading-md" color="neutral-900" rule="1줄 말줄임" />
        <element name="카테고리" font="body-sm"    color="neutral-600" rule="" />
        <element name="거리/시간" font="body-sm"   color="primary-500" rule="아이콘(16px)+텍스트" />
        <element name="영업 상태" font="body-xs"   rule="영업중:success, 준비중:neutral-500" />
      </preset>

      <preset name="메뉴카드">
        <element name="이미지"   spec="80×80px radius-sm" rule="우측 배치" />
        <element name="메뉴명"   font="heading-sm" color="neutral-900" rule="2줄 max" />
        <element name="설명"     font="body-md"    color="neutral-600" rule="2줄 말줄임" />
        <element name="가격"     font="price (20/700 Inter)" color="neutral-900" rule="" />
        <element name="품절"     rule="이미지 오버레이 60% 딤 + '품절' body-md #FFF" />
      </preset>

    </component>

    <!-- 3.5 Modal -->
    <component name="Modal">

      <spec platform="mobile">
        <width>calc(100% - 32px)</width>
        <max-height>85vh</max-height>
        <padding>24px</padding>
        <radius>radius-lg (16) 상단만 (바텀시트형)</radius>
        <shadow>shadow-xl</shadow>
        <backdrop>rgba(0,0,0,0.5)</backdrop>
        <z-index>z-modal (40)</z-index>
        <animation-open>하단→상단 slide 300ms</animation-open>
        <animation-close>상단→하단 slide 300ms</animation-close>
        <close-methods>X 버튼(44×44) + 외부 탭 + 하향 스와이프</close-methods>
      </spec>

      <spec platform="desktop">
        <width>480px (sm) · 640px (md) · 800px (lg)</width>
        <max-height>80vh</max-height>
        <padding>32px</padding>
        <radius>radius-lg (16) 전체</radius>
        <shadow>shadow-xl</shadow>
        <backdrop>rgba(0,0,0,0.5)</backdrop>
        <z-index>z-modal (40)</z-index>
        <animation-open>opacity 0→1 + scale(0.95→1) 200ms</animation-open>
        <animation-close>opacity 1→0 200ms</animation-close>
        <close-methods>X 버튼 + 외부 클릭 + ESC 키</close-methods>
      </spec>

      <states>
        <state name="default" note="표시" />
        <state name="loading" note="내부 스켈레톤" />
        <state name="error"   note="에러 메시지 + 재시도 버튼" />
      </states>

      <structure>
        <part name="헤더" spec="타이틀(heading-md) + 닫기 아이콘" />
        <part name="본문" spec="스크롤 가능" />
        <part name="푸터" spec="CTA 버튼 우측 정렬, 간격 8px" />
      </structure>

    </component>

    <!-- 3.6 Drawer -->
    <component name="Drawer" platform="관리자 웹 전용">
      <spec width="360" position="fixed right:0" height="100vh" padding="24"
            shadow="shadow-xl" backdrop="rgba(0,0,0,0.3)" z-index="z-modal (40)"
            animation="translateX(100%→0) 300ms ease-in-out"
            close="X 버튼 + 외부 클릭 + ESC" />
      <states>
        <state name="default" />
        <state name="loading" note="Modal과 동일" />
        <state name="error"   note="Modal과 동일" />
      </states>
    </component>

    <!-- 3.7 Toast -->
    <component name="Toast">

      <spec platform="mobile" position="top:72px 중앙" width="calc(100%-32px)" />
      <spec platform="desktop" position="top-right:24px 24px" width="360px" />

      <common min-height="48" padding="12 16" radius="radius-md (12)"
              shadow="shadow-lg" z-index="z-toast (50)"
              duration-default="3000ms" duration-error="5000ms"
              animation-in="translateY(-16→0)+opacity 200ms"
              animation-out="opacity 1→0 200ms" />

      <variants>
        <variant type="success" bg="success-light" icon="✓ success 20px" text-color="success-dark" />
        <variant type="error"   bg="error-light"   icon="✕ error 20px"   text-color="error-dark" />
        <variant type="warning" bg="warning-light" icon="⚠ warning 20px" text-color="warning-dark" />
        <variant type="info"    bg="info-light"    icon="ℹ info 20px"    text-color="info-dark" />
      </variants>

      <states>
        <state name="default"    note="자동 소멸" />
        <state name="persistent" note="닫기 버튼 필수, 수동 닫기" />
        <state name="action"     note="액션 버튼 포함" />
      </states>

    </component>

    <!-- 3.8 Table -->
    <component name="Table" platform="관리자 웹 전용">

      <spec header-bg="neutral-50" header-font="body-md/600 neutral-700"
            cell-font="body-md/400 neutral-800" cell-padding="12 16"
            row-height-min="48" row-divider="1px neutral-200"
            radius="radius-md (12) 외곽만" />

      <states>
        <state name="default"  note="" />
        <state name="hover"    bg="neutral-50" duration="200ms" />
        <state name="selected" bg="primary-50" border-left="3px primary-500" />
        <state name="disabled" opacity="0.5" />
        <state name="loading"  note="스켈레톤 행 3~5개, pulse 애니메이션" />
        <state name="error"    note="에러 배너 + 재시도 버튼 (테이블 상단)" />
        <state name="empty"    note="중앙 일러스트 + body-lg/neutral-500 텍스트" />
      </states>

      <sort-icon size="16" position="헤더 우측" states="↕ default · ↑ asc · ↓ desc" />
      <pagination position="하단 우측" button-size="sm" options="10·25·50건" />

    </component>

  </components>

  <!-- ============================================================ -->
  <!-- 4. 접근성(A11y) 체크리스트                                     -->
  <!-- ============================================================ -->
  <accessibility>
    <check id="1"  item="색상 대비"        standard="WCAG AA 4.5:1 (일반), 3:1 (대형/아이콘)" target="전체" />
    <check id="2"  item="포커스 링"        standard="2px info outline, offset 2px"           target="전체" />
    <check id="3"  item="터치 타겟"        standard="최소 44×44px"                           target="모바일" />
    <check id="4"  item="alt 텍스트"       standard="의미 있는 이미지 필수, 장식 alt=''"      target="전체" />
    <check id="5"  item="aria-label"       standard="아이콘 전용 버튼 필수"                   target="전체" />
    <check id="6"  item="폼 라벨"          standard="label for='' 또는 aria-labelledby"      target="전체" />
    <check id="7"  item="키보드 탐색"      standard="Tab순서=시각순서, Enter/Space"           target="전체" />
    <check id="8"  item="에러 안내"        standard="aria-invalid + aria-describedby"        target="폼" />
    <check id="9"  item="모달 포커스 트랩" standard="열림시 내부 고정, 닫힘시 트리거 복귀"    target="모달/드로어" />
    <check id="10" item="로딩 상태"        standard="aria-busy=true + role=status"           target="비동기 영역" />
    <check id="11" item="모션 제어"        standard="prefers-reduced-motion:reduce→0ms"      target="전체" />
    <check id="12" item="색상만 의존 금지" standard="아이콘+텍스트 병행"                      target="전체" />
    <check id="13" item="스크린리더 순서"  standard="시맨틱 HTML (nav, main, section)"       target="전체" />
    <check id="14" item="텍스트 리사이즈"  standard="200% 확대시 레이아웃 유지"               target="전체" />
  </accessibility>

  <!-- ============================================================ -->
  <!-- 5. UI QA 체크리스트                                            -->
  <!-- ============================================================ -->
  <ui-qa>
    <check id="1"  category="디자인 토큰"    item="색상 토큰 준수"          criteria="하드코딩 HEX 금지, 토큰만 사용" />
    <check id="2"  category="디자인 토큰"    item="타이포 토큰 준수"        criteria="정의된 스케일 외 크기 금지" />
    <check id="3"  category="디자인 토큰"    item="간격 토큰 준수"          criteria="4px 배수 외 값 금지" />
    <check id="4"  category="컴포넌트"       item="7가지 상태 구현"         criteria="default/hover/active/focus/disabled/loading/error" />
    <check id="5"  category="컴포넌트"       item="아이콘 일관성"           criteria="단일 아이콘 세트(Lucide 권장)" />
    <check id="6"  category="레이아웃"       item="모바일 320px 축소"       criteria="수평 스크롤 없음" />
    <check id="7"  category="레이아웃"       item="고정 요소 콘텐츠 겹침"   criteria="패딩 규칙 적용 확인" />
    <check id="8"  category="레이아웃"       item="Safe Area 적용"         criteria="iOS 노치·홈바 대응" />
    <check id="9"  category="인터랙션"       item="터치 타겟 44px"          criteria="히트 영역 검증" />
    <check id="10" category="인터랙션"       item="호버 피드백"             criteria="모든 클릭 가능 요소 cursor:pointer" />
    <check id="11" category="인터랙션"       item="트랜지션 범위"           criteria="150~300ms, transform/opacity만" />
    <check id="12" category="텍스트"         item="말줄임(ellipsis)"        criteria="긴 텍스트 오버플로 처리" />
    <check id="13" category="텍스트"         item="빈 상태"                 criteria="데이터 없을 때 빈 상태 UI" />
    <check id="14" category="성능"           item="이미지 최적화"           criteria="WebP + lazy loading + srcset" />
    <check id="15" category="성능"           item="스켈레톤 로딩"           criteria="콘텐츠 점프 방지" />
    <check id="16" category="다크모드"       item="대비 검증"               criteria="라이트/다크 4.5:1 이상" />
    <check id="17" category="크로스브라우저" item="Safari·Chrome·Samsung" criteria="iOS Safari 특이사항 확인" />
  </ui-qa>

  <!-- ============================================================ -->
  <!-- 6. 가정 (Assumptions)                                          -->
  <!-- ============================================================ -->
  <assumptions>
    <assumption id="1"  item="브랜드 메인 컬러"      value="Orange #FF6F00"                        rationale="배달의민족 벤치마킹, 식음료 업종" />
    <assumption id="2"  item="한글 기본 폰트"        value="Pretendard"                            rationale="한국 앱 업계 표준, 무료" />
    <assumption id="3"  item="영문/숫자 폰트"        value="Inter"                                 rationale="Pretendard와 x-height 호환" />
    <assumption id="4"  item="최소 지원 기기"        value="iPhone SE (320px)"                     rationale="구형 기기 커버" />
    <assumption id="5"  item="바텀 네비 항목 수"     value="4개 (홈·검색·주문내역·마이)"          rationale="벤치마킹 앱 평균" />
    <assumption id="6"  item="관리자 웹 최소 해상도" value="1024px"                                rationale="PC 전용 가정" />
    <assumption id="7"  item="아이콘 세트"           value="Lucide Icons"                          rationale="MIT 라이선스, 일관 스트로크" />
    <assumption id="8"  item="다크모드"              value="MVP 미포함"                            rationale="추후 대응, 토큰 확장 가능" />
    <assumption id="9"  item="다국어"                value="미지원 (한국어 전용)"                  rationale="MVP 범위" />
    <assumption id="10" item="PG 결제 화면"          value="외부 SDK 호출 (인앱 UI 아님)"          rationale="일반적 PG 연동 방식" />
    <assumption id="11" item="슬롯 시간 간격"        value="5분 단위 (5/10/15/20분)"               rationale="요구사항 기반" />
    <assumption id="12" item="주문 상태"             value="5단계 (접수대기·수락·조리중·완료·거절)" rationale="요구사항 확장" />
    <assumption id="13" item="토스트 자동 소멸"      value="3초(일반)/5초(에러)"                   rationale="UX 관행" />
    <assumption id="14" item="모달 바텀시트 전환"    value="모바일=바텀시트, 웹=센터 모달"          rationale="플랫폼 컨벤션" />
  </assumptions>

</design-system>
```

> **문서 끝** — 본 XML은 `상세서.md`와 1:1 대응하며, AI 에이전트가 구조적으로 파싱하여 화면 생성·코드 구현에 활용할 수 있습니다.
