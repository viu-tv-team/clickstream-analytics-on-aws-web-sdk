// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseTracker } from './BaseTracker';
import { Event } from '../provider';
import { ClickstreamAttribute } from '../types';

export class PageLoadTracker extends BaseTracker {
	observer: PerformanceObserver | undefined;

	init() {
		this.trackPageLoad = this.trackPageLoad.bind(this);
		if (this.isSupportedEnv()) {
			/**
			 * The original code is commented out and is incompatible with older browsers.
			this.observer = new PerformanceObserver(() => {
				this.trackPageLoad();
			});
			this.observer.observe({ entryTypes: ['navigation'] });
			*/

			if (typeof PerformanceObserver !== 'undefined' &&
				PerformanceObserver.supportedEntryTypes !== undefined) {

				this.observer = new PerformanceObserver(() => {
					this.trackPageLoad();
				});

				try {
					this.observer.observe({
						type: 'navigation',
						buffered: true
					});
				} catch (error) {
					console.error('PerformanceObserver observe failed:', error);
					this.trackPageLoad();
				}
			} else {
				console.warn('PerformanceObserver not fully supported, using fallback');
				this.trackPageLoad();
			}
		}
		if (this.isPageLoaded()) {
			this.trackPageLoad();
		}
	}

	trackPageLoad() {
		if (!this.context.configuration.isTrackPageLoadEvents) return;
		const performanceEntries = performance.getEntriesByType('navigation');
		if (performanceEntries && performanceEntries.length > 0) {
			const latestPerformance =
				performanceEntries[performanceEntries.length - 1];
			const eventAttributes: ClickstreamAttribute = {};
			for (const key in latestPerformance) {
				const value = (latestPerformance as any)[key];
				const valueType = typeof value;
				if (Event.ReservedAttribute.TIMING_ATTRIBUTES.includes(key)) {
					if (valueType === 'string' || valueType === 'number') {
						eventAttributes[key] = value;
					} else if (Array.isArray(value) && value.length > 0) {
						eventAttributes[key] = JSON.stringify(value);
					}
				}
			}
			this.provider.record({
				name: Event.PresetEvent.PAGE_LOAD,
				attributes: eventAttributes,
			});
		}
	}

	isPageLoaded() {
		const performanceEntries = performance.getEntriesByType('navigation');
		return performanceEntries?.[0]?.duration > 0 || false;
	}

	isSupportedEnv(): boolean {
		return !!performance && typeof PerformanceObserver !== 'undefined';
	}
}
