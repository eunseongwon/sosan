/**
 * 외부 API 관련 타입 정의.
 * 실제 API 호출은 Spring 백엔드에서 처리된다.
 * 이 파일은 프론트 컴포넌트에서 사용하는 타입 정의만 유지한다.
 */

/* ── 국토교통부 상업업무용 실거래가 ── */
export interface CommercialContext {
  sigunguCode: string;
  regionName: string;
  latestYearMonth: string;
  trades: {
    buildingName: string;
    use: string;
    floor: string;
    area: string;
    amount: string;
    dong: string;
  }[];
  avgAmountPerPyeong: number;
  sampleCount: number;
}

/* ── 소상공인시장진흥공단 상가정보 ── */
export interface SbizStore {
  bizesNm: string;
  rdnmAdr: string;
  lnoAdr: string;
  bldNm: string;
  flrNo: string;
  indsSclsNm: string;
  indsMclsNm: string;
  adongNm: string;
  lon: string;
  lat: string;
}

export interface SbizStoreData {
  regionName: string;
  totalCount: number;
  stores: SbizStore[];
  buildingGroups: {
    bldNm: string;
    address: string;
    floors: string[];
    bizTypes: string[];
    count: number;
  }[];
}

/* ── 한국부동산원 R-ONE 임대료 지수 ── */
export interface RoneRentItem {
  period: string;
  regionName: string;
  rentIndex: number;
  changeRate: number;
}

export interface RoneRentContext {
  regionName: string;
  latestPeriod: string;
  items: RoneRentItem[];
  summary: string;
}

/* ── 중소벤처24 정부 지원사업 (SupportController 응답 포맷) ── */
export interface BizinfoItem {
  id: string | number;
  title: string;
  org: string;
  amount: string;
  deadline: string;
  status: string;
  desc: string;
  url: string;
}

export interface BizinfoContext {
  items: BizinfoItem[];
  total: number;
}
