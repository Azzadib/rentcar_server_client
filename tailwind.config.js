module.exports = {
    purge: ['./**/*.html'],
    darrkMode: 'class',
    theme: {
        backgroundColor: theme => ({
            ...theme('colors'),
        }),
        height: {
            "5v" : "5vh",
            "7v" : "7vh",
            "10v" : "10vh",
            "12v" : "12vh",
            "14v" : "14vh",
            "16v" : "16vh",
            "18v" : "18vh",
            "20v" : "20vh",
            "22v" : "22vh",
            "24v" : "24vh",
            "26v" : "26vh",
            "28v" : "28vh",
            "30v" : "30vh",
            "40v" : "40vh",
            "42v" : "42vh",
            "44v" : "44vh",
            "46v" : "46vh",
            "48v" : "48vh",
            "50v" : "50vh",
            "51v" : "51vh",
            "52v" : "52vh",
            "60v" : "60vh",
            "64v" : "64vh",
            "66v" : "66vh",
            "68v" : "68vh",
            "70v" : "70vh",
            "72v" : "72vh",
            "74v" : "74vh",
            "78v" : "78vh",
            "80v" : "80vh",
            "90v" : "90vh",
            "100v" : "100vh",
        },
        extend: {
            animation: {
                'pulse-fast': 'pulse 0.1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'pulse-med': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            },
            spacing: {
                '88': '22rem',
                '92': '23rem'
            }
        }
    },
    variants: {
        extend: {
            animation: ['hover', 'focus', 'active'],
            zIndex: ['hover', 'focus', 'active'],
            cursor: ['hover', 'focus', 'active'],
            translate: ['hover', 'focus', 'active'],
            transform: ['hover', 'focus', 'active'],
            scale: ['active', 'focus', 'group-hover'],
            borderWidth: ['hover', 'focus', 'active'],
            borderStyle: ['hover', 'focus', 'active'],
            margin: ['hover', 'focus', 'active'],
            width: ['hover', 'focus', 'active'],
            backgroundColor: ['active'],
        }
    },
    plugins: [
        require('@tailwindcss/forms')
    ],
}