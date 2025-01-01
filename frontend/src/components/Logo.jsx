
function Logo() {
  return (
    <div className="flex items-center justify-center mb-4">
      <div className="bg-indigo-100 p-3 rounded-full">
        {/* <Users className="w-8 h-8 text-indigo-600" /> */}
        <img src='/logo.png' alt='logo' className='w-12 h-12' />
      </div>
    </div>
  );
}

export default Logo;