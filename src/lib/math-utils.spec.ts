import { describe, expect, it } from 'vitest';
import { getFrames } from './math-utils';
describe('getFrames', () => {
	it('Should turn [1,1], [4, 2] into if(lt(t,1),NaN,if(lte(t,2),(3*t)-2,NaN))', () => {
		const result = getFrames([
			{
				time: 1,
				value: 1
			},
			{
				time: 2,
				value: 4
			}
		]);

		expect(result).toBe('if(lt(t,1),NaN,if(lte(t,2),(3*t)-2,NaN))');
	});
	it('Should turn [1,1], [4, 2], [13,5] into if(lt(t,1),NaN,if(lte(t,2),(3*t)-2,if(lte(t,5),(3*t)-2,NaN)))', () => {
		const result = getFrames([
			{
				time: 1,
				value: 1
			},
			{
				time: 2,
				value: 4
			},
			{
				time: 5,
				value: 13
			}
		]);

		expect(result).toBe('if(lt(t,1),NaN,if(lte(t,2),(3*t)-2,if(lte(t,5),(3*t)-2,NaN)))');
	});
});
