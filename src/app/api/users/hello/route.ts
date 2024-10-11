import { NextResponse } from 'next/server';

export async function GET(){
    const r:number=Math.random();
    return NextResponse.json({msg:"Hello"+r})
}