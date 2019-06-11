import React, { useEffect, useState, useRef } from 'react';
import { fromEvent, merge, interval, Observable, from, of, Subject } from 'rxjs';
import { tap, map, filter, take, mergeAll, mergeMap, flatMap, takeUntil } from 'rxjs/operators';
import './App.css';
import { scan } from 'rxjs/operators';
import { audit } from 'rxjs/operators'

function App() {
  useEffect(() => {
    const $canvas = document.querySelector('.canvas')
    const ctx = $canvas.getContext('2d')
    ctx.beginPath()
    const draw = e => {
      ctx.lineTo(e.x, e.y); // 移到滑鼠在的位置
      ctx.stroke(); // 畫畫
    }

    const clickDown$ = fromEvent($canvas, 'mousedown')
      .pipe(
        tap(e => {
          ctx.moveTo(e.clientX, e.clientY)
        }),
        flatMap(e => {
          return fromEvent($canvas, 'mousemove').pipe(
            takeUntil(fromEvent($canvas, 'mouseup'))
          )
        }),
        tap(draw),
      )
      .subscribe(console.log)
  })

  return (
    <div className="App">
      <canvas className="canvas"></canvas>
    </div>
  );
}

export default App;
