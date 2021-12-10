var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
const json = require('body-parser/lib/types/json');
var app = express();
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const fs = require('fs'); // 설치 x
const path = require('path'); // 설치 x
const configs3 = require('../config/s3.json');
const ec2 = require('../config/ec2.json');
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

    app.listen(ec2, function () {
        console.log('서버 실행 중...');
        
    });  
    //s3 연결
    const s3 = new aws.S3(configs3);
      
      const upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: "moizaimage", // 버킷 이름
            //contentType: multerS3.AUTO_CONTENT_TYPE, // 자동을 콘텐츠 타입 세팅
            acl: 'public-read', // 클라이언트에서 자유롭게 가용하기 위함
            key: (req, file, cb) => {
                console.log(file);
                cb(null, file.originalname)
            },
        }),
      });
    //connection.connect();


//유저, 프로필 관련
var userApi = require('./user');
app.get('/users/login/:id', userApi.getUser);//로그인 api. main에 띄운 것 만 가져옴     !ok
app.post('/users', upload.single('image'),userApi.postUser);//회원가입 api. 로그인하고 uid가 없을 때(프로필 정보 입력)  !ok
app.get('/users/alluser/:id', userApi.getAllUser);//전체 회원 조회  !ok
app.put('/users/:id',upload.single('image'),userApi.updateUser);//유저 업데이트
app.get('/users/:id',userApi.getProfile); //내 프로필 정보 가져오기 - 다른사람 프로필 가져올때는 다른사람 id 보내주면 됨.

//메인화면 api
var mainApi = require('./main');
app.get('/main/:id',mainApi.getMain);   //  !ok

//좋아요 처리 api
var likeApi = require('./like');
app.post('/like',likeApi.putLike); //좋아요 사람 추가   !ok
app.post('/like/delete',likeApi.deleteLike); //좋아요 사람 삭제     !ok

//팀 관련 api
var teamApi = require('./team');
app.post('/teams', teamApi.postTeam); //팀 생성     !ok
app.post('/teams/delete',teamApi.deleteTeam);//팀 삭제  !ok
app.get('/teams/allteams/:id',teamApi.getAllTeam);//모든 팀 정보 가져오기
app.get('/teams/myteams/:id',teamApi.getMyTeam);//연락하기 누르고 초대할 공모전 선택 시 띄울 정보
app.get('/teams/:id',teamApi.getTeam);//나의 팀 정보 가져오기(자세한 정보)
app.get('/teams/select/:id',teamApi.getSelectTeam);//선택한 팀 정보 가져오기

//지원자, 지원하기 관련 api
var applyApi = require('./apply');
app.get('/apply',applyApi.applyTeam); //지원하기 누르면 공모전명, 학교, 전공 띄우기
app.post('/apply',applyApi.postApplyTeam);//메시지 전송 누르고 지원확정하기
app.get('/apply/list',applyApi.getApplyList); //지원 목록 가져오기
app.get('/apply/detail/:id',applyApi.getApplyDetail); //목록 중 한명 상세보기

//팀 멤버 관리 api
var team_memberApi = require('./team_member');  
app.post('/team_members',team_memberApi.postTeamMember);//팀원으로 추가하기(팀 가입하기)    !ok
app.get('/team_members',team_memberApi.getAllTeamMember);//팀원 정보 가져오기   !ok
app.post('/team_members/delete',team_memberApi.deleteTeamMember);//팀 탈퇴하기  !ok

//공모전 정보 api   !ok
var competApi = require('./compet');
app.get('/compets/:id', competApi.getAllCompet);//공모전 정보 가져오기. 넣는건 크롤링서버에서 함    !ok
app.get('/compets/select/:id',competApi.getSelectCompet); //선택된 공모전 정보 가져오기 (공모전 해당 팀 정보와 함께)    !ok

//북마크 처리 api   !ok
var bookmarkApi = require('./bookmark');
app.post('/bookmark/team',bookmarkApi.putBookmark); //팀 북마크 추가    !ok
app.post('/bookmark/team/delete',bookmarkApi.deleteBookmark); //팀 북마크 삭제  !ok
app.post('/bookmark/compet',bookmarkApi.putCompetBookmark); //공모전 북마크 추가    !ok
app.post('/bookmark/compet/delete',bookmarkApi.deleteCompetBookmark); //공모전 북마크 삭제  !ok

//태그 처리 api     !ok
var tagApi = require('./stack');
app.get('/tag/title',tagApi.getTitle); //큰 태그 가져오기
app.get('/tag/tech/:title_num',tagApi.getTech); //가져온 큰 태그에 맞춰 작은 태그 보여주기
app.post('/tag/puttech',tagApi.putTech); //내 기술목록으로 넣기
app.post('/tag/delete',tagApi.deleteTech); //넣은 태그 삭제하기(취소)
app.get('/tag/getmytech/:id',tagApi.getMyTech); //내 기술목록 가져오기. 다른사람꺼 가져올때도 이거 사용. 
 
//검색 api  !ok
var searchApi = require('./search');
app.get('/search/teams/:id',searchApi.getSearchTeam); //팀 목록 검색
app.get('/search/filterteams/:id',searchApi.getFilterTeam); //팀 구하기 필터링 하고 띄우기
app.get('/search/filterprofiles/:id',searchApi.getFilterProfile);//프로필 검색 시 필터링하고 띄우기
app.get('/search/profiles/:id',searchApi.getSearchProfile);//프로필 검색하기
app.get('/search/filtercompets/:id',searchApi.getFilterCompet);//공모전 검색 시 필터링하고 띄우기
app.get('/search/compets/:id',searchApi.getSearchCompet);//공모전 검색하기


//connection.end();

