<script lang="ts">

</script>

<div class="
    flex flex-col justify-center items-center
    h-2/3 w-screen
    ">
    <div class="
    bg-gray-900
    h-100 w-100
        ">
        <div class="
        group
        bg-gray-600
        h-8
        flex flex-row justify-evenly
        ">
            <input type="radio" class="hidden peer/register" id="register" name="choose-auth" checked>
            <label for="register" class="
            text-gray-200 hover:text-gray-50
            font-bold
            duration-150
            cursor-pointer
            text-center
            flex-1
            flex items-center justify-center
            peer-checked/register:bg-blue-500 not-peer-checked/register:hover:bg-gray-400
            ">
                REGISTER
            </label>
            <input type="radio" class="hidden peer/login" id="login" name="choose-auth">
            <label for="login" class="
            group
            text-gray-200 hover:text-gray-50 font-bold
            duration-150
            cursor-pointer
            text-center
            flex-1
            flex items-center justify-center
            peer-checked/login:bg-blue-500 not-peer-checked/login:hover:bg-gray-400
            ">
                LOGIN
            </label>
        </div>
        <div class="h-full peer-checked/login:bg-red-300 w-full"></div>
    </div>
</div>

<style>
    @import "tailwindcss";
</style>