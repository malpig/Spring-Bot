document.createElement("canvas");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
context.fillStyle = `rgb(0,0,0)`;
context.fillRect(0, 0, canvas.width, canvas.height);
var cLeft = canvas.offsetLeft + canvas.clientLeft, cTop = canvas.offsetTop + canvas.clientTop;
var startTime = 0, currentTime = 0, seconds = 0;
var iid;
var xpos = [0, 0, 0], xvel = [0, 0, 0], ypos = [0, 0, 0], yvel = [0, 0, 0];
var g = 60, dt = .03, m = [1, 1, 1];
var k = [30, 30, 30], eq = [100, 100, 100]
var floorY = 40;
var mu = .70;

canvas.addEventListener('click', function (event)
{
    var x = event.pageX - cLeft, y = event.pageY - cTop;
    var i;
    for (i = 0; i < 3; i++)
    {
        if (x <= 520 && x >= 20)
        {
            if (y <= 680 + 50 * i && y >= 650 + 50 * i)
            {
                eq[i] = x - 20;
                drawRec();
            }
        }
            
    }
}, false);
function setColor(cn)
{
    var col = [0, 0, 0];
    col[cn] = 255;
    context.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
    context.strokeStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
}
function drawRec()
{
    var i;
    context.fillStyle = `rgb(0,0,0)`;
    context.fillRect(0,600,canvas.width,200)
    for (i = 0; i < 3; i++)
    {
        setColor(i);
        context.beginPath();
        context.moveTo(20, 650 + 50 * i);
        context.lineTo(520, 650 + 50 * i);
        context.lineTo(520, 680 + 50 * i);
        context.lineTo(20, 680 + 50 * i);
        context.lineTo(20, 650 + 50 * i);
        context.stroke();
        context.fillRect(20, 650 + 50 * i, eq[i], 30)
    }
}
function drawcircle(x,y,r)
{
    if (y > 600)
        y = 595;
    context.beginPath();
    context.arc(x, 600 - y, r, 0, 2 * Math.PI, true);
    context.fill();
 }
function evolution()
{
    var fF = [0,0,0];
    var i, a, b, r, rx, ry, f;
    for (i = 0; i < 3; i++)
    {
        yvel[i] -= g * dt;
        if (ypos[i] < floorY) {
            fF[i] = (floorY - ypos[i]) * 100 / m[i];
            yvel[i] += fF[i] * dt;
        }
        else
        {
            fF[i] = 0;
        }
        if (i == 0)
        {
            a = 1;
            b = 2;
        }
        else
        {
            a = 0;
            b = 3 - i;
        }
        rx = xpos[b] - xpos[a];
        ry = ypos[b] - ypos[a];
        r = Math.sqrt(rx * rx + ry * ry);
        f = k[i] * (r - eq[i]);
        xvel[a] += f * rx / (m[a] * r) * dt;
        yvel[a] += f * ry / (m[a] * r) * dt;
        xvel[b] -= f * rx / (m[b] * r) * dt;
        yvel[b] -= f * ry / (m[b] * r) * dt;
    }
    for (i = 0; i < 3; i++)
    {
        if (fF[i] > 0)
        {
            if (xvel[i] > 0)
            {
                xvel[i] -= (mu * fF[i]) * dt / m[i];
                if (xvel[i] < 0)
                    xvel[i] = 0;
            }
            else
            {
                xvel[i] += (mu * fF[i]) * dt / m[i];
                if (xvel[i] > 0)
                    xvel[i] = 0;
            }
        }
    }
    for (i = 0; i < 3; i++)
    {
        xpos[i] += xvel[i] * dt;
        ypos[i] += yvel[i] * dt;
        xvel[i] *= 0.99;
        yvel[i] *= 0.99;
    }
    context.fillStyle = `rgb(0,0,0)`;
    context.fillRect(0, 0, canvas.width, 600);
    context.strokeStyle = `rgb(100,150,100)`;
    context.beginPath();
    context.moveTo(0, 600 - floorY);
    context.lineTo(1200, 600 - floorY);
    context.stroke();
    context.fillStyle = `rgb(100,0,100)`;
    for (i = 0; i < 3; i++)
    {
        drawcircle(xpos[i], ypos[i], 5);
    }
    for (i = 0; i < 3; i++)
    {
        if (i == 0) {
            a = 1;
            b = 2;
        }
        else {
            a = 0;
            b = 3 - i;
        }
        setColor(i);
        context.beginPath();
        context.moveTo(xpos[a], 600 - ypos[a]);
        context.lineTo(xpos[b], 600 - ypos[b]);
        context.stroke();
    }
    if (false)
        clearInterval(iid);
    currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - startTime > seconds) {
        seconds = currentTime - startTime;
        document.getElementById("time").innerHTML = `Time: ${seconds}`;
    }
    if (xpos[1] > 1200 && xpos[2] > 1200 && xpos[0] > 1200)
    {
        document.getElementById("time").innerHTML = `Final Time Is ${seconds} seconds`;
        clearInterval(iid);
    }
}
function go()
{
    eq = [100, 100, 100];
    ypos = [39.09999649615201, 124.13535835606537, 39.09999649615203];
    xpos = [59.62263943356491, 110.00000000000003, 160.37736056643516];
    yvel = [0, 0, 0];
    xvel = [0, 0, 0];
    eq = [100, 100, 100];
    clearInterval(iid);
    iid = setInterval(evolution, 1);
    drawRec();
    currentTime = Math.floor(Date.now() / 1000);
    startTime = Math.floor(Date.now() / 1000);
    seconds = 0;
}