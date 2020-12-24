var playing = false;
var app = new Vue({
    el: '#app',
    data: {
        value1: 33,
        query: '',
        songList: [],
        songValue: '',
        songUrl: '',
        pauseSrc: 'pic/播放.png',
        play: false,
        songTime: 0,
        songContinue: {},
        songPic: 'pic/sun.jpg',
        songRotate: {},
        mmusicTF: false,//是否显示禁止播放
        musicNum: 0,//初始旋转角度
        musicRotate: "rotate(" + 0 + "deg)",
        interval: null,//定时器
    },
    mounted() {
        window.onPause = this.onPause;    // 方法赋值给window
        
    },
    methods: {
        search() {
            var that = this;
            axios.get("https://autumnfish.cn/search?keywords=" + this.query)
                .then(function (response) {
                    console.log(response);
                    that.songList = response.data.result.songs;
                }, function (err) { })
            this.query = '';
        },
        choose(songID, name) {
            console.log(songID);
            this.musicRotate = 0;
            document.getElementById("processnow").style.width="0px";
            this.songValue = name;
            var that = this;
            axios.get("https://autumnfish.cn/song/url?id=" + songID)
                .then(function (response) {
                    console.log(response);
                    that.songUrl = response.data.data[0].url;
                    console.log(that.songUrl);
                }, function (err) { })
            axios.get("https://autumnfish.cn/song/detail?ids=" + songID)
                .then(function (response) {
                    console.log(response);
                    that.songPic = response.data.songs[0].al.picUrl;
                    console.log(that.songPic);
                }, function (err) { })
        },

        onPlay() {
            var audio = document.querySelector('#audio');
            this.play = true;
            playing = true;
            audio.play();
            this.songContinue = setInterval("process()", 1000);
            this.musicTF = false
            this.countMusicNum();

        },
        onPause() {
            var audio = document.querySelector('#audio');
            this.play = false;
            playing = false;
            audio.pause();
            clearInterval(this.songContinue);
            this.musicTF = true;
            if (this.interval !== null) {
                clearInterval(this.interval);  //停止定时器
            }
        },
        countMusicNum() {
            console.log("旋转");
            let that = this;
            that.interval = setInterval(function () {
                that.musicNum = that.musicNum + 10;
                that.musicRotate = "rotate(" + that.musicNum + "deg)";
            }, 100);
        }

    }
})
var aud = document.querySelector('#audio')
var progress = document.getElementById("processnow");
var addprogress = 0;
var songTime = 0;
audio.addEventListener("canplay", function () {//设置监听，点击时获取时长
    songTime = parseInt(audio.duration);
});

//进度条主函数
function process() {
    if (document.getElementById("processnow").style.width != '180px') {
        console.log("动态增加");
        addprogress += (180 / songTime);
        progress.style.width = addprogress + 'px';
    } else {
        onPause();
    }
}

