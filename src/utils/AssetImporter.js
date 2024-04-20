export const assets = Object.values(import.meta.glob('../../assets/**/*.{png,jpg,jpeg,PNG,JPEG}', { eager: true, as: 'url' }));
