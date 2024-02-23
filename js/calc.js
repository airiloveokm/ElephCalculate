
//神名の必要数
const needSinmei = [30, 80, 100, 120, 120, 180]

$('#btnStartCalc').on('click', function(){
    console.log("[DEBUG] 計算開始");

    //神明計算開始
    var startIdx = parseInt($('#nowLank').val());
    var endIdx = parseInt($('#goalLank').val());
    var rateIdx = parseInt($('#rateVal').val());
    var rateMax = parseInt($('#rateMax').val());

    //Validation Check
    if(rateIdx < 5 && !rateMax)
    {
        $("#result").removeClass('collapse');
        $('#result').text('交換レートが5個以下の場合、現在交換可能な数を確認して入力してください.');
    }

    //必要な神明数を計算する
    var needQnt = 0;
    for(var i = startIdx; i < endIdx; i++)
    {
        needQnt += needSinmei[i];
    }

    //所持している神明数を差し引く
    var haveQnt = $('#haveSinmei').val();
    if(haveQnt)
    {
        needQnt -= haveQnt;
    }

    //計算する
    var resQnt = 0;
    for(var i = rateIdx; i <= 5; i++)
    {
        if(i == 5)
        {
            resQnt += (i * needQnt);
        }
        else if(i == rateIdx)
        {
            var exQnt = Math.min(needQnt, rateMax);
            resQnt += (i * exQnt)
            needQnt -= exQnt;
        }
        else
        {
            resQnt += (i * Math.min(needQnt, 20));
            needQnt -= 20;
        }

        //必要数を満たしたら抜ける
        if(needQnt <= 0)
        {
            break;
        }
    }

    $("#result").removeClass('collapse');
    $("#result").text("必要な神名のカケラ数は" + resQnt + "個です。")
})