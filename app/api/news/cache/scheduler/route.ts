import { NextRequest, NextResponse } from 'next/server';
import cacheCleanupScheduler from '../../../../../utils/cacheCleanup';

// GET - Get scheduler status
export async function GET() {
  try {
    const status = cacheCleanupScheduler.getStatus();
    
    return NextResponse.json({
      success: true,
      scheduler: status,
      message: status.isRunning ? 'Scheduler is running' : 'Scheduler is stopped'
    });
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    return NextResponse.json({
      success: false,
      message: 'Error getting scheduler status'
    }, { status: 500 });
  }
}

// POST - Control scheduler (start/stop/trigger)
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    switch (action) {
      case 'start':
        cacheCleanupScheduler.start();
        return NextResponse.json({
          success: true,
          message: 'Scheduler started successfully'
        });
        
      case 'stop':
        cacheCleanupScheduler.stop();
        return NextResponse.json({
          success: true,
          message: 'Scheduler stopped successfully'
        });
        
      case 'trigger':
        const result = await cacheCleanupScheduler.triggerCleanup();
        return NextResponse.json({
          success: true,
          cleanup: result,
          message: 'Manual cleanup triggered'
        });
        
      case 'status':
        const status = cacheCleanupScheduler.getStatus();
        return NextResponse.json({
          success: true,
          scheduler: status
        });
        
      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action. Use: start, stop, trigger, or status'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error controlling scheduler:', error);
    return NextResponse.json({
      success: false,
      message: 'Error controlling scheduler'
    }, { status: 500 });
  }
}