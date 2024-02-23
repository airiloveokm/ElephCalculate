
//神名の必要数
const needSinmei = [30, 80, 100, 120, 120, 180]

$('#btnStartCalc').on('click', function(){
    console.log("[DEBUG] 計算開始");

    //神明計算開始
    var startIdx = parseInt($('#nowLank').val());
    var endIdx = parseInt($('#goalLank').val());
    var rateIdx = parseInt($('#rateVal').val());
    var rateMax = parseInt($('#rateMax').val());
    var haveQnt = parseInt($('#haveSinmei').val());

    //Validation Check
    if(rateIdx < 5 && !rateMax)
    {
        $("#result").removeClass('collapse');
        $('#result').html('交換レートが5個以下の場合、<br />現在交換可能な数を確認して入力してください.');
        return;
    }
    if(Number.isNaN(haveQnt))
    {
        $("#result").removeClass('collapse');
        $('#result').html('所持神名数の入力が不正です.<br />入力内容を見直してください');
        return;
    }

    //必要な神明数を計算する
    var needQnt = 0;
    for(var i = startIdx; i < endIdx; i++)
    {
        needQnt += needSinmei[i];
    }

    //所持している神明数を差し引く
    needQnt -= haveQnt;

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
});

$('#rateMax').on('blur', function(){
    var rateMax = parseInt($('#rateMax').val());
    if(!rateMax)
    {
        //流れに任せる（あとでValidationチェックするし）
        return;
    }

    if(rateMax > 20)
    {
        $('#rateMax').val('20');
    }
    if(rateMax < 0)
    {
        $('#rateMax').val('0');
    }
});