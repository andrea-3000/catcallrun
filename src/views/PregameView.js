import gfw.views.ScreenView as ScreenView;
import gfw.conf.ImageStats as ImageStats;

import ui.ImageView as ImageView;
import ui.View as View;
import animate;

exports = Class(ScreenView, function(supr) {

  var pgImgs = PREGAME_DIR;
  var img = new ImageStats({
    images: {
      s1t1: pgImgs + 'animOne text1.png',
      s1t2: pgImgs + 'animOne text2.png',
      s1i1: pgImgs + 'animOne img1.png',
      s2t1: pgImgs + 'animTwo text1.png',
      s2t2: pgImgs + 'animTwo text2.png',
      s2t3: pgImgs + 'animTwo text3.png',
      s2t4: pgImgs + 'animTwo text4.png',
      s2i1: pgImgs + 'animTwo img1.png',
      s2i2: pgImgs + 'animTwo img2.png',
      s3t1: pgImgs + 'animThree text1.png',
      s3t2: pgImgs + 'animThree text2.png',
      s3t3: pgImgs + 'animThree text3.png',
      s3i1: pgImgs + 'animThree img1.png',
      s4t1: pgImgs + 'animFour text1.png',
      s4t2: pgImgs + 'animFour text2.png',
      s4t3: pgImgs + 'animFour text3.png',
      s4i1: pgImgs + 'animFour calculator.png',
      s4i2: pgImgs + 'animFour pencil.png',

      buttonArrow: pgImgs + 'animTwo arrowRight.png',
      startButton: pgImgs + 'startButton.png',
      skipButton: pgImgs + 'skipButton.png'
    }
  });

  this.init = function(opts) {
    supr(this, 'init', arguments);

    this.pageIndex = 0;

    this.designView();
  };

  this.leftButtonClicked = function() {
    if (this.pageIndex >= 1){
      this.pageIndex--;
      this.setVisibleSection(this.pageIndex);
    } 
    else {
      controller.transitionToGame();
    }
  };

  this.rightButtonClicked = function() {
    if (this.pageIndex < 3){
      this.pageIndex++;
      this.setVisibleSection(this.pageIndex);
    }
    else {
      controller.transitionToGame();
    }
  };

  this.setVisibleSection = function(sectionIndex) {
    var oldSection = this.currentSection;
    this.currentSection = sectionIndex;
    if (oldSection >= 0){
      var oldSectionView = this.sections[oldSection];
      animate(oldSectionView).now({opacity: 0}, 250);
    }
    if (sectionIndex >= 0){
      var currentSectionView = this.sections[sectionIndex];
      animate(currentSectionView).now({opacity: 1}, 250);
    }
    if (sectionIndex == 1){
      animate(this.s2i3).now({scaleX:0,scaleY: 0}, 0).wait(250).then({scaleX:1,scaleY: 1}, 1500, animate.easeOutElastic);
      animate(this.s2i4).now({scaleX:0,scaleY: 0}, 0).wait(1600).then({scaleX:1,scaleY: 1}, 1500, animate.easeOutElastic);
    }
    if (sectionIndex == 3){
      animate(this.s4i1).now({opacity:0}, 0).wait(250).then({opacity:1}, 1500);
      animate(this.s4i2).now({opacity:0}, 0).wait(1600).then({opacity:1}, 1500);
    }
    this.rightButton.style.visible = sectionIndex < 3;
    this.startButton.style.visible = sectionIndex == 3;

    this.leftButton.style.visible = sectionIndex > 0;
    this.skipButton.style.visible = sectionIndex == 0;
  }

  this.designView = function() {
    var s = this.style;
    this.background = new ImageView({
      superview: this,
      backgroundColor: "#0ba8f6",
      width: s.width,
      height: s.height
    });

    this.sections = []; 
    this.currentSection = -1; 
    this.bottomY = s.height - 150;

    var arrowY = this.bottomY + 45;
    this.leftButton = new ImageView({
      superview: this,
      image: img.buttonArrow.path,
      flipX: true,
      x: 20,
      y: arrowY,
      width: img.buttonArrow.w,
      height: img.buttonArrow.h
    });

    this.skipButton = new ImageView({
      superview: this,
      image: img.skipButton.path,
      x: 20,
      y: arrowY,
      width: img.skipButton.w,
      height: img.skipButton.h
    });

    this.rightButton = new ImageView({
      superview: this,
      image: img.buttonArrow.path,
      x: (s.width - img.buttonArrow.w) - 20,
      y: arrowY,
      width: img.buttonArrow.w,
      height: img.buttonArrow.h
    });

    this.startButton = new ImageView({
      superview: this,
      image: img.startButton.path,
      x: (s.width - (img.startButton.w * 2)) - 20,
      y: arrowY - 30,
      width: img.startButton.w *2,
      height: img.startButton.h *2
    })

    // SECTION ONE
    var s1Container = new View({
      superview: this,
      width: s.width,
      opacity: 0,
      height: this.bottomY
    });

    this.sections[0] = s1Container;
    
    this.s1t1 = new ImageView({
      superview: s1Container,
      image: img.s1t1.path,
      width: img.s1t1.w,
      height: img.s1t1.h,
      x: (s.width - img.s1t1.w) / 2,
      y: 20
    });

    this.s1t2 = new ImageView({
      superview: s1Container,
      image: img.s1t2.path,
      width: img.s1t2.w,
      height: img.s1t2.h,
      x: (s.width - img.s1t2.w) / 2,
      y: this.bottomY - img.s1t2.h - 20
    });

    this.s1i1 = new ImageView({
      superview: s1Container,
      image: img.s1i1.path,
      width: 400,
      height: 550,
      x: (s.width - 400) / 2,
      y: 145

    })

    // SECTION TWO
    var s2Container = new View({
      superview: this,
      width: s.width,
      opacity: 0,
      height: this.bottomY
    });

    this.sections[1] = s2Container;
    
    this.s2t1 = new ImageView({
      superview: s2Container,
      image: img.s2t1.path,
      width: img.s2t1.w,
      height: img.s2t1.h,
      x: (s.width - img.s2t1.w) / 2,
      y: 20
    });

    this.s2t2 = new ImageView({
      superview: s2Container,
      image: img.s2t2.path,
      width: img.s2t2.w,
      height: img.s2t2.h,
      x: (s.width - img.s2t2.w) / 2,
      y: this.bottomY - img.s2t2.h - 20
    });

    var girlY = 350;
    var leftGirlX = s.width * .27 - 30;
    var rightGirlX = s.width * .72 - 30;

    this.s2t3 = new ImageView({
      superview: s2Container,
      image: img.s2t3.path,
      width: img.s2t3.w,
      height: img.s2t3.h,
      offsetX: -img.s2t3.hw,
      offsetY: -img.s2t3.hh, 
      x: leftGirlX,
      y: girlY
    });

    this.s2t4 = new ImageView({
      superview: s2Container,
      image: img.s2t4.path,
      width: img.s2t4.w,
      height: img.s2t4.h,
      offsetX: -img.s2t4.hw,
      offsetY: -img.s2t4.hh, 
      x: rightGirlX,
      y: girlY
    });

    this.s2i3 = new ImageView({
      superview: s2Container,
      image: img.s2i2.path,
      width: img.s2i2.w/3,
      height: img.s2i2.h/3,
      offsetX: -img.s2i2.hw/3,
      offsetY: -img.s2i2.hh/3, 
      anchorX: img.s2i2.hw/3,
      anchorY: img.s2i2.hw/3,
      x: leftGirlX,
      y: girlY
    });

    this.s2i4 = new ImageView({
      superview: s2Container,
      image: img.s2i2.path,
      width: img.s2i2.w,
      height: img.s2i2.h,
      offsetX: -img.s2i2.hw,
      offsetY: -img.s2i2.hh, 
      anchorX: img.s2i2.hw,
      anchorY: img.s2i2.hh,
      x: rightGirlX,
      y: girlY
    });

    this.s2i1 = new ImageView({
      superview: s2Container,
      image: img.s2i1.path,
      width: img.s2i1.w,
      height: img.s2i1.h,
      offsetX: -img.s2i1.hw,
      offsetY: -img.s2i1.hh, 
      x: leftGirlX,
      y: girlY
    });

    this.s2i2 = new ImageView({
      superview: s2Container,
      image: img.s2i1.path,
      width: img.s2i1.w,
      height: img.s2i1.h,
      offsetX: -img.s2i1.hw,
      offsetY: -img.s2i1.hh, 
      x: rightGirlX,
      y: girlY
    });

    // SECTION THREE
    var s3Container = new View({
      superview: this,
      width: s.width,
      opacity: 0,
      height: this.bottomY
    });

    this.sections[2] = s3Container;
    
    this.s3t1 = new ImageView({
      superview: s3Container,
      image: img.s3t1.path,
      width: img.s3t1.w,
      height: img.s3t1.h,
      x: (s.width - img.s3t1.w) / 2,
      y: 30
    });

     this.s3i1 = new ImageView({
      superview: s3Container,
      image: img.s3i1.path,
      width: img.s3i1.w,
      height: img.s3i1.h,
      x: (s.width - img.s3i1.w) / 2,
      y: 140
    });

    this.s3t2 = new ImageView({
      superview: s3Container,
      image: img.s3t2.path,
      width: img.s3t2.w,
      height: img.s3t2.h,
      x: (s.width - img.s3t2.w) / 2,
      y: (s.height + 30) * .43
    });

    this.s3t3 = new ImageView({
      superview: s3Container,
      image: img.s3t3.path,
      width: img.s3t3.w,
      height: img.s3t3.h,
      x: (s.width - img.s3t3.w) / 2,
      y: (s.height + 30) * .76
    });

    //SECTION FOUR
    var s4Container = new View({
      superview: this,
      width: s.width,
      height: this.bottomY,
      opacity: 0
    });

    this.sections[3] = s4Container;
    
    this.s4t1 = new ImageView({
      superview: s4Container,
      image: img.s4t1.path,
      width: img.s4t1.w,
      height: img.s4t1.h,
      x: (s.width - img.s4t1.w) / 2,
      y: 30
    });

    this.s4i1 = new ImageView({
      superview: s4Container,
      image: img.s4i1.path,
      width: img.s4i1.w,
      height: img.s4i1.h,
      x: (s.width - img.s4i1.w) / 2,
      y: 200
    });

    this.s4t2 = new ImageView({
      superview: s4Container,
      image: img.s4t2.path,
      width: img.s4t2.w,
      height: img.s4t2.h,
      x: (s.width - img.s4t2.w) / 2,
      y: (s.height + 30) * .43
    });

     this.s4i2 = new ImageView({
      superview: s4Container,
      image: img.s4i2.path,
      width: img.s4i2.w,
      height: img.s4i2.h,
      x: (s.width - img.s4i2.w) / 2,
      y: (s.height + 30) * .55
    });

    this.s4t3 = new ImageView({
      superview: s4Container,
      image: img.s4t3.path,
      width: img.s4t3.w,
      height: img.s4t3.h,
      x: (s.width - img.s4t3.w) / 2,
      y: (s.height + 30) * .76
    });

    this.setVisibleSection(0);
  };

  this.onInputStart = function(evt, point) {
    if (point.y >= this.bottomY){
      if (point.x <= this.style.width/2){
        this.leftButtonClicked();
      }
      else {
        this.rightButtonClicked();
      }
    }
  };

  this.resetView = function() {};

  this.constructView = function() {};

  this.deconstructView = function(callback) {};
});