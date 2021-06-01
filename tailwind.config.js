module.exports = {
    purge: ['./**/*.html'],
    darrkMode: 'class',
    theme: {
        backgroundColor: theme => ({
            ...theme('colors'),
            'header': '#3FAEF3'
        }),
        height: {
            "5v" : "5vh",
            "7v" : "7vh",
            "10v" : "10vh",
            "20v" : "20vh",
            "30v" : "30vh",
            "40v" : "40vh",
            "50v" : "50vh",
            "60v" : "60vh",
            "64v" : "64vh",
            "66v" : "66vh",
            "70v" : "70vh",
            "78v" : "78vh",
            "80v" : "80vh",
            "90v" : "90vh",
            "100v" : "100vh",
        }
    },
    variants: {
        extend: {
            animation: ['hover', 'focus', 'active'],
            zIndex: ['hover', 'focus', 'active'],
            cursor: ['hover', 'focus']
        }
    },
    plugins: [
        require('@tailwindcss/forms')
    ],
}