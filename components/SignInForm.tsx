
export default function SignInForm() {
        <form action="">
            <div className="flex flex-col">
                <label htmlFor="email">อีเมล</label>
                <input type="email" name="email" id="email" />
            </div>
            <div className="flex flex-col">
                <label htmlFor="password">รหัสผ่าน</label>
                <input type="password" name="password" id="password" />
            </div>
            <div className="flex flex-col">
                <button type="submit">เข้าสู่ระบบ</button>
            </div>
        </form>

}