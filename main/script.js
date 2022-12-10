
var container = document.getElementById("map"); 
var options = {
  center: new kakao.maps.LatLng(37.54, 126.96), //지도의 중심좌표
  level: 8, //지도의 레벨(확대, 축소 정도)
};

var map = new kakao.maps.Map(container, options); 

// 지도의 우측에 확대 축소 컨트롤을 추가
let zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);


const dataSet = [
  {
    title: "희락돈까스",
    address: "서울 영등포구 양산로 210",
    url: "https://www.youtube.com/watch?v=QV2mT69wPDM",
    category: "양식",
  },
  {
    title: "즉석우동짜장",
    address: "서울 영등포구 대방천로 260",
    url: "https://www.youtube.com/watch?v=69XbRnzwydg",
    category: "한식",
  },
  {
    title: "아카사카",
    address: "서울 서초구 서초대로74길 23",
    url: "https://www.youtube.com/watch?v=5YeceyCzGx4",
    category: "일식",
  },
  {
    title: "승리돼지국밥",
    address: "경남 창원시 진해구 진해대로 640",
    category: "한식",
    url: "https://www.youtube.com/watch?v=VP2APbEQ9zo"
  },
  {
    title: "85번실내포장마차",
    address: "경남 진주시 동진로 208-1",
    category: "한식",
    url: "https://www.youtube.com/watch?v=hzNaa4F-8Z8"
  },
  {
    title: "냠냠물고기",
    address: "서울 송파구 송파대로30길 41-21",
    category: "회/초밥",
    url: "https://www.youtube.com/watch?v=80QtYJrGFe4"
  },
  {
    title: "춘리마라탕",
    address: "서울 노원구 공릉로 199",
    category: "중식",
    url: "https://youtube.com/shorts/Cm_Mqry4LRI?feature=share"
  },
  {
    title: "신토불이 떡볶이",
    address: "서울 광진구 자양로43길 42",
    category: "분식",
    url: "https://youtu.be/mSL_sFSduQs"
  },
  {
    title: "임금돼지",
    address: "서울 중랑구 동일로 932 2단지상가",
    category: "구이",
    url: "https://youtu.be/NGzbvO9w1D0"
  },
]; 

// 주소 - 좌표 변환 함수 (비동기 문제 발생 해결)
// 주소-좌표 변환 객체 생성
var geocoder = new kakao.maps.services.Geocoder();

function getCoordsByAddress(address) {
  return new Promise((resolve, reject) => {
    // 주소로 좌표를 검색
    geocoder.addressSearch(address, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        resolve(coords);
        return;
      }
      reject(new Error("getCoordsByAddress Error: not valid Address"));
    });
  });
}

setMap(dataSet);


function getContent(data) {
  let replaceUrl = data.url;
  let finUrl = "";
  replaceUrl = replaceUrl.replace("https://youtu.be/", "");
  replaceUrl = replaceUrl.replace("https://www.youtube.com/embed/", "");
  replaceUrl = replaceUrl.replace("https://www.youtube.com/watch?v=", "");
  finUrl = replaceUrl.split("&")[0];

  return `<div class="infowindow">
<div class="infowindow-img-container">
  <img src="https://img.youtube.com/vi/${finUrl}/mqdefault.jpg" class="infowindow-img"><a href="${data.url}"></a></img>
</div>
<div class="infowindow-body">
  <h5 class="infowindow-title">${data.title}</h5>
  <p class="infowindow-address">${data.address}</p>
  <a href="${data.url}" class="infowindow-btn" target="_blank">링크</a>
</div>
</div>`;
}


async function setMap(dataSet) {
  for (var i = 0; i < dataSet.length; i++) {
    let coords = await getCoordsByAddress(dataSet[i].address);

    // 마커 생성
    var marker = new kakao.maps.Marker({
      map: map, // 마커 표시할 지도
      position: coords, // 마커 표시할 위치
    });

    markerArray.push(marker);

    // 마커 표시할 인포윈도우 생성
    var infowindow = new kakao.maps.InfoWindow({
      content: getContent(dataSet[i]), // 인포윈도우에 표시할 내용
    });

    infowindowArray.push(infowindow);

   // 1. 클릭시 다른 인포윈도우 닫기
   // 2. 클릭한 마커로 지도 중심 이동하기
    kakao.maps.event.addListener(
      marker,
      "click",
      makeOverListener(map, marker, infowindow, coords)
    );
    // 맵 클릭시 인포윈도우 클로즈
    kakao.maps.event.addListener(map, "click", makeOutListener(infowindow));
  }
}


function makeOverListener(map, marker, infowindow, coords) {
  return function () {
    // 1. 클릭시 다른 인포윈도우 닫기
    closeInfowindow();
    infowindow.open(map, marker);
    // 2. 클릭한 곳으로 지도 중심 이동
    map.panTo(coords);
  };
}

let infowindowArray = [];
function closeInfowindow() {
  for (let infowindow of infowindowArray) {
    infowindow.close();
  }
}

function makeOutListener(infowindow) {
  return function () {
    infowindow.close();
  };
}


const categoryMap = {
  korea: "한식",
  china: "중식",
  japan: "일식",
  america: "양식",
  wheat: "분식",
  meat: "구이",
  sushi: "회/초밥",
  etc: "기타",
  mark: "북마크"
};

const categoryList = document.querySelector(".category-list");
categoryList.addEventListener("click", categoryHandler);

// 카테고리 클릭 핸들러
function categoryHandler(event) {
  const categoryId = event.target.id;
  const category = categoryMap[categoryId];
  //카테고리에 해당하는 데이터 따로 분류
  let categorizedDataSet = [];
  for (let data of dataSet) {
    if (data.category === category) {
      categorizedDataSet.push(data);
    }
  }


  // 모든 마커 삭제
  closeMarker();

  // 모든 인포윈도우 닫기
  closeInfowindow();

  // 카테고리에 해당하는 데이터만 마커로 표시
  setMap(categorizedDataSet);
}

// 마커 삭제 함수
let markerArray = [];
function closeMarker() {
  for (marker of markerArray) {
    marker.setMap(null);
  }
}