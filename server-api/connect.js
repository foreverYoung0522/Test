var mysql      = require('mysql');


// 비밀번호는 별도의 파일로 분리해서 버전관리에 포함시키지 않아야 합니다. 
exports.sqlconnect = function(){
    var connection = mysql.createConnection({
        host     : 'dataserver.cl3y46ehchzv.ap-northeast-2.rds.amazonaws.com',    // 호스트 주소
        user     : 'admin',           // mysql user
        password : 'dh134679!',       // mysql password
        database : 'dataServer',     // mysql 데이터베이스
        port: 3306
    });

    return connection;
}