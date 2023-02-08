// Необхідно реалізувати наступний функціонал як на відео Puzzle, а саме:

// — Необхідно розбити картинку на 16 рівних частин і помістити їх в блокию
//   Розбивати картинку на кусочки можна за допомогою background-position
// — При кліку на кнопку Start game або при перетягуванні пазла на правий блок(використовуємо drag & drop)
//   має запуститися зворотній відлік. Сама кнопка має заблокуватися.
// — Якщо час закінчився і ви не встигли скласти пазл має видати повідомлення в модальному 
//   вікні: “It's a pity, but you lost”. Кнопка Check result має заблокуватися
// — При кліку на кнопку Check result має видати повідомлення в модальному 
//   вікні: “You still have time, you sure?” з часом який залишився.
// — При кліку на кнопку Check перевіряється чи добре складений пазл, якщо так видає 
//   повідомлення: “Woohoo, well done, you did it!” в іншому
//   варіанті “It's a pity, but you lost”. Кнопка Check result має заблокуватися.
// — При кліку на кнопку Close закриває модальне вікно.
// — При кліку на кнопку New game скидує час і заново рандомно розставляє пазли. 
//   Кнопка Start game має розблокуватися, а кнопка Check result має бути заблокована.

"use strict";

$(function () {
  // variables
  let time = 61;
  let timer;
  let chose = 1;

  //  sortable puzzle
  $(".puzzle-box").sortable({
    connectWith: ".puzzle-box",
    containment: ".puzzle-game",
    cursor: "move",
    scroll: false,
    delay: 300,
    start: function (event, ui) {
      if (time == 61) {
        $(".btn-start").trigger("click");
      }
    },
    receive: function (event, ui) {
      if ($(this).attr("value") == "fill") {
        chose = 1;
      } else {
        $(this).attr("value", "fill");
        chose = 0;
      }
    },
    stop: function (event, ui) {
      if (chose) {
        $(this).sortable("cancel");
      } else {
        $(this).removeAttr("value");
      }
    },
  });

  // random puzzle (new game)
  puzzleFill();

  // button puzzle
  $(".btn-start").click(() => {
    time = 60;
    $(".btn-start").attr("disabled", true);
    $(".btn-result").removeAttr("disabled");
    timer = setInterval(timerStart, 1000);
  });
  $(".btn-result").click(() => {
    clearInterval(timer);
    $(".modal-time").text(time > 9 ? `00:${time}` : `00:0${time}`);
    modalOpen(1);
  });
  $(".btn-new").click(() => {
    $(".btn-start").removeAttr("disabled");
    $(".countTimer").text("01:00");
    puzzleFill();
  });
  // button modal
  $(".btn-closeSure").click(() => {
    timer = setInterval(timerStart, 1000);
    modalClose(1);
  });
  $(".btn-check").click(() => {
    if (gameCheck() == 16) {
      modalChange(1);
    } else {
      modalChange(0);
    }
  });
  $(".btn-closeLose").click(() => modalClose(2));
  $(".btn-closeWin").click(() => modalClose(3));

  // functions puzzleFill()
  function puzzleFill() {
    let check = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let position;
    for (let i = 0; i < 16; i++) {
      $(".game-start>.puzzle-box").attr("value", "fill");
      $(".game-end>.puzzle-box").removeAttr("value");
      do {
        position = Math.round(Math.random() * 15);
      } while (check[position]);
      $(`.pzl:eq(${i})`).attr("value", `${position + 1}`);
      $(`.game-start>.puzzle-box:eq(${i})`).append($(`.pzl:eq(${i})`));
      check[position] = 1;
    }
    $(".pzl").css("background-image", "url(image/ww.png)");
  }
  // timerStart()
  function timerStart() {
    $(".countTimer").text(--time > 9 ? `00:${time}` : `00:0${time}`);
    if (!time) {
      clearInterval(timer);
      if (gameCheck() == 16) {
        modalOpen(3);
      } else {
        modalOpen(2);
      }
    }
  }
  // gameCheck()
  function gameCheck() {
    time = 61;
    let checkResult = 0;
    for (let i = 0; i < 16; i++) {
      if ($(`.game-end>.puzzle-box:eq(${i})>.pzl`).attr("value") == i + 1) {
        checkResult++;
      }
    }
    $(".btn-result").attr("disabled", true);
    return checkResult;
  }

  // modal show & hide
  function modalOpen(num) {
    let alert =
      num == 1 ? ".modal-sure" : num == 2 ? ".modal-lose" : ".modal-win";
    $(".modal").fadeIn(300);
    $(`${alert}`).show();
    $(`${alert}`).animate(
      {
        marginTop: "50px",
      },
      300
    );
  }
  function modalChange(num) {
    $(".modal-sure").hide();
    num
      ? $(".modal-win").css("margin-top", "50px")
      : $(".modal-lose").css("margin-top", "50px");
    num ? $(".modal-win").show() : $(".modal-lose").show();
  }
  function modalClose(num) {
    let alert =
      num == 1 ? ".modal-sure" : num == 2 ? ".modal-lose" : ".modal-win";
    $(`${alert}`)
      .animate(
        {
          marginTop: "0px",
        },
        300
      )
      .fadeOut();
    $(".modal").fadeOut(300);
  }
});