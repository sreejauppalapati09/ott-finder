
const countryBackgrounds: Record<string, string> = {
    'United States': 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'India': 'https://images.pexels.com/photos/8996547/pexels-photo-8996547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'United Kingdom': 'https://images.pexels.com/photos/4119932/pexels-photo-4119932.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'Canada': 'https://images.pexels.com/photos/7991158/pexels-photo-7991158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'Australia': 'https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'Germany': 'https://images.pexels.com/photos/14299464/pexels-photo-14299464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'France': 'https://images.pexels.com/photos/7234322/pexels-photo-7234322.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'Japan': 'https://images.pexels.com/photos/5792327/pexels-photo-5792327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'Brazil': 'https://images.pexels.com/photos/4009409/pexels-photo-4009409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'Mexico': 'https://images.pexels.com/photos/11831414/pexels-photo-11831414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'Spain': 'https://images.pexels.com/photos/66134/pexels-photo-66134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'South Korea': 'https://images.pexels.com/photos/3747132/pexels-photo-3747132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
};

const defaultBackground = 'https://images.pexels.com/photos/274937/pexels-photo-274937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

export const getBackgroundImage = (country: string): string => {
    return countryBackgrounds[country] || defaultBackground;
};
