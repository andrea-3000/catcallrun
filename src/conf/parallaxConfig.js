exports = {
    velocity: 1000,
    // padding: {
    //     right: 50,
    //     left: 50
    // },
    layers: [
      /*{
        distance: 100,
        image: 'resources/images/bg_back.png',
        width: 1024,
        height: 1024
    }, */{
        distance: 100,
        images: [
          'resources/images/game/cloud_360.png'
        ],
        width: 200,
        height: 100,
        bottom: 200,
        spawnPaddingMin: 100,
        spawnPaddingRange: 100
    }, {
        distance: 30,
        images: [
          'resources/images/game/cloud_360.png'
        ],
        width: 140,
        height: 90,
        bottom: 120,
        spawnPaddingMin: 100,
        spawnPaddingRange: 100
    }, {
        distance: 16,
        images: [
            "resources/images/game/lamppost.png"
        ],
        width: 50,
        height: 100,
        bottom: 50,
        spawnPadding: 200
    }]
};
