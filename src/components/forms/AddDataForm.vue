<template>
    <div class="container">
        <button id="open">
            Click Me
        </button>
        <div class="model-container" id="model_container">
            <div class="model">
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minima accusantium obcaecati saepe deserunt
                    porro, quibusdam dolores, beatae veritatis numquam incidunt dolore hic. Neque, iure sint perferendis
                    vero vitae doloremque libero?
                </p>
                <button id="close">
                    Close Me
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "addDataForm"

}

const open = document.getElementById('open');
const model_container = document.getElementById('model_container');
const close = document.getElementById('close');
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.container {
    background-color: cyan;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    margin: 0;
}

button {
    padding: 10px 15px;
    border: unset;
    border-radius: 5px;
    color: #212121;
    z-index: 1;
    background: #e8e8e8;
    position: relative;
    font-weight: 500;
    font-size: 15px;
    -webkit-box-shadow: 1px 2px 4px -1px rgba(0, 0, 0, 0.27);
    box-shadow: 1px 2px 4px -1px rgba(0, 0, 0, 0.27);
    transition: all 250ms;
    overflow: hidden;

}

.model-container {
    background-color: rgba(0, 0, 0, 0.3);
    align-items: center;
    display: flex;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
}
.model-container.show{
    pointer-events: auto;
    opacity: 1;
}

.model {
    background-color: #fff;
    width: 40%;
    max-width: 100%;
    padding: 10px 20px;
    border-radius: 10px;
    text-align: center;
}

.model h1 {
    margin: 0;
}

.model p {
    opacity: 0.7;
}
</style>