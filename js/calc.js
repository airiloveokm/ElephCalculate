//定数
const labelName = ['年齢', '誕生日', '身長', '趣味', '固有武器'];
const variantName = ['age', 'birthday', 'height', 'hobby', 'weapon'];
const localUrl = "https://airiloveokm.github.io/BlueArchiveQuiz/";

//グローバル変数
let random = new Random(getSeed());

let mode = 0;
let data = null;

let already = [];

let questCnt = 0;
let correctIdx = 0;
let correctCnt = 0;

//イベントリスナ
$("#btnAnswer1").on('click', function(){ checkAnswer(1); });
$('#btnAnswer2').on('click', function(){ checkAnswer(2); });
$('#btnAnswer3').on('click', function(){ checkAnswer(3); });
$('#btnAnswer4').on('click', function(){ checkAnswer(4); });
$('#btnNext').on('click', function(){ generateQuiz(); });
$('.btnRestart').on('click', function(){ restart() });
$('.btnCopy').on('click', function(){ postToClipboard() });
$('.btnX').on('click', function(){ postToX() });
$('.btnMisskey').on('click', function(){ postToMisskey() });
$('.dummy').on('click', function(e) { e.preventDefault(); });

//問題を生成する
function generateQuiz()
{
    initializeUI();

    questCnt++;
    correctIdx = Math.floor( Math.random() * 4 ) + 1;

    const dataLen = data.length;
    const questionIdx = getQuestionIdx(dataLen);
    const genreIdx = questionIdx[0];
    const charaIdx = questionIdx[1];

    $('#question-number').html(questCnt);
    $('#question-chara').html(data[charaIdx].name);
    $('#question-genre').html(labelName[genreIdx]);
    $('#btnAnswer' + correctIdx).html(data[charaIdx][variantName[genreIdx]]);

    //選択肢に同じものが2つ出現しないための対策
    let answers = [];
    answers.push(data[charaIdx][variantName[genreIdx]]);

    for(var i = 1; i <= 4; i++ )
    {
        if(i != correctIdx)
        {
            let randIdx = 0;
            while(true)
            {
                randIdx = Math.floor( Math.random() * dataLen );

                if(charaIdx != randIdx)
                {
                    if(!answers.includes(data[randIdx][variantName[genreIdx]]))
                    {
                        answers.push(data[randIdx][variantName[genreIdx]]);
                        break;
                    }
                }
            }

            $('#btnAnswer' + i).html(data[randIdx][variantName[genreIdx]]);
        }
    }
}

//正解とするインデックスを決定する
function getQuestionIdx(maxValue)
{
    let ret1, ret2;
    while(true)
    {
        if(mode == 0)
        {
            //Daily mode
            ret1 = random.nextFromRange(0, 4);
            ret2 = random.nextFromRange(0, maxValue);
        }
        else
        {
            ret1 = Math.floor( Math.random() * 5 );
            ret2 = Math.floor( Math.random() * maxValue );
        }

        if(!already.some(a => a[0] == ret1 && a[1] == ret2))
        {
            already.push([ret1, ret2]);
            break;
        }
    }

    return [ret1, ret2];
}

//デイリー用：ランダム変数のシード値
function getSeed()
{
    const today = new Date(new Date().toUTCString());
    if(today.getHours() >= 19)
    {
        //UTC19:00以降の場合、日付を進める(日本に合わせる)
        today.setDate(today.getDate() + 1)
    }
    const dateString = "" + today.getFullYear() + today.getMonth() + today.getDay();

    return Number(dateString);
}

//プロフィールJSONを取得
function loadJsonFile() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        // サーバーからのレスポンスが正常＆通信が正常に終了したとき                
        if(req.readyState == 4 && req.status == 200) {
            // 取得したJSONファイルの中身を変数へ格納
            data = JSON.parse(req.responseText);
        }
    };
    //HTTPメソッドとアクセスするサーバーのURLを指定
    req.open("GET", "./data/profile.json?202410140852", false);
    //実際にサーバーへリクエストを送信
    req.send(null);

}

//答え合わせ
function checkAnswer(buttonIdx)
{
    for(i = 1; i <= 4; i++)
    {
        if(i == correctIdx)
        {
            $("#btnAnswer" + i).addClass('button-correct');
        }
        else
        {
            $("#btnAnswer" + i).addClass('button-incorrect');
        }
    }

    if(correctIdx == buttonIdx)
    {
        correctCnt++;
    }

    $('.correctCounter').html(correctCnt);
    if(mode == 0 && questCnt == 5)
    {
        //デイリーは5問で終了
        displayResult();
    }
    else if(mode == 1 && correctIdx != buttonIdx)
    {
        //エンドレスモードで不正解時は終了
        displayResult();
    }
    else if(questCnt >= 4 * data.length)
    {
        //総計出題数がデータ量を上回る場合はゲーム終了
        displayResult();
    }
    else
    {
        $('#divNext').removeClass('collapse');
    }
}

//UIを初期化する
function initializeUI()
{
    if(mode == 0)
    {
        $('#divEndless').addClass('collapse');
    }
    else
    {
        $('#divEndless').removeClass('collapse');
    }
    $('.correctCounter').html(correctCnt);
    $('#divNext').addClass('collapse');
    $('#btnAnswer1').removeClass('button-correct').removeClass('button-incorrect');
    $('#btnAnswer2').removeClass('button-correct').removeClass('button-incorrect');
    $('#btnAnswer3').removeClass('button-correct').removeClass('button-incorrect');
    $('#btnAnswer4').removeClass('button-correct').removeClass('button-incorrect');
}

//変数をリセットする
function reset()
{
    random = new Random(getSeed());
    already = [];
    
    questCnt = 0;
    correctIdx = 0;
    correctCnt = 0;
}

//クエリからモードを取得する
//mode=1が指定されている場合はエンドレス、他はデイリー
function getModeFromQuery()
{
    const queries = window.location.search.slice(1);

    if(queries)
    {
        queries.split('&').forEach(function(queryStr) {
            // = で分割してkey,valueをオブジェクトに格納
            var queryArr = queryStr.split('=');
            if(queryArr[0].toLowerCase() == "mode")
            {
                if(queryArr[1] == "1")
                {
                    mode = 1;
                }
            }
        });
    }

    if(mode == 0)
    {
        $('#lnkDaily').addClass('active');
    }
    else
    {
        $('#lnkEndless').addClass('active');
    }
}

//結果を表示
function displayResult()
{
    if(mode == 0)
    {
        $("#resultMessage").html("5問中 " + correctCnt + "問正解しました！");
    }
    else
    {
        $("#resultMessage").html("" + correctCnt + " 問連続で正解しました！");
        $("#divEndless").addClass('collapse');
    }

    $("#divResult").removeClass('collapse');
}

//ゲームリスタート
function restart()
{
    reset();
    generateQuiz();
}

//クリップボードへポスト
function postToClipboard()
{
    navigator.clipboard.writeText(generateReport() + "\n\n" + localUrl);
}

//Xへポスト
function postToX()
{
    const x = "https://x.com/share?text={msg}&url={url}";
    const msg = encodeURIComponent(decodeURIComponent(generateReport() + "\n"));
    const url = encodeURIComponent(decodeURIComponent(localUrl));

    window.open(x.replace("{msg}", msg).replace("{url}", url));
}

//Misskeyへノート
function postToMisskey()
{
    const misskey = "https://misskey-hub.net/ja/share/?text={msg}&url={url}";
    const msg = encodeURIComponent(decodeURIComponent(generateReport() + "\n\n"));
    const url = encodeURIComponent(decodeURIComponent(localUrl));

    window.open(misskey.replace("{msg}", msg).replace("{url}", url));
}

//結果文を生成
function generateReport()
{
    let ret;
    if(mode == 0)
    {
        ret = "今日の #ブルくい は5問中" + correctCnt + "問正解しました！";
    }
    else
    {
        ret = "#ブルくい エンドレスチャレンジで" + correctCnt + "問連続正解しました！";
    }

    return ret;
}

//ロード時処理
$(function(){
    getModeFromQuery();
    loadJsonFile();
    generateQuiz();
});
