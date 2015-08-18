var express = require('express');
var router = express.Router();
var jusolink = require('jusolink');

jusolink.config({
  LinkID :'TESTER_JUSO', //링크아이디
  SecretKey : 'FjaRgAfVUPvSDHTrdd/uw/dt/Cdo3GgSFKyE1+NQ+bc=', //비밀키
  defaultErrorHandler :  function(Error){
    console.log('Error Occur : [' + Error.code + '] ' + Error.message);
  }
});

// 주소검색 API 모듈초기화
var jusolinkService = jusolink.JusolinkService();

router.get('/', function(req, res, next) {
  res.render('index');
});

//주소검색 단가확인
router.get('/getUnitCost', function(req, res, next){
  jusolinkService.getUnitCost(
    function(unitCost){
      res.render('result', { path : req.path, result : unitCost });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

//잔여포인트 확인
router.get('/getBalance', function(req,res,next){
  jusolinkService.getBalance(
    function(remainPoint){
      res.render('result', {path : req.path, result : remainPoint})
    }, function(Error){
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
  });
});

// 주소검색 결과화면
router.get('/search', function(req,res,next){
  res.render('search', {path : req.path})
});

// 주소검색 팝업
router.get('/zipcode', function(req,res,next){

  if(req.query.IndexWord){
    var Index = req.query.IndexWord;       // 검색어
    var PageNum = req.query.PageNum;       // 페이지번호
    var PerPage = 20;                      // 페이지 목록 갯수
    var noSuggest = false;                 // 수정제시어 기능 끄기
    var noDifferential = false;            // 차등검색 기능 끄기

    jusolinkService.search(Index, PageNum, PerPage, noSuggest, noDifferential,
      function(Response){
        res.render('zipcode', {path : req.path, result : Response})
      }, function(Error){
        res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
  } else {
    var tmp = null;
    res.render('zipcode', {path : req.path, result : tmp})
  }
});


module.exports = router;
